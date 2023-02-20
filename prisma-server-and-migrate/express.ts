import express from "express";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";
import bodyParser from "body-parser";
import fs from "fs";

const cors = require("cors")({
  origin: (origin: any, callback: any) => {
    return callback(null, true);
  },
});

function toJson(data: any) {
  // https://stackoverflow.com/a/58253280
  return JSON.stringify(data, (_, v) =>
    typeof v === "bigint" ? `${v}n` : v
  ).replace(/"(-?\d+)n"/g, (_, a) => a);
}

class PrismaDb {
  private prisma: any;
  constructor() {
    this.prisma = new PrismaClient();
  }

  getUser = async (name: string) => {
    await this.prisma.$connect();
    const res = await this.prisma.user.findUnique({
      where: {
        nickname: name,
      },
    });
    await this.prisma.$disconnect();
    return res;
  };

  createCompany = async (input: {
    name: string;
    branch_id: number;
    full_address: string;
    phone: number;
    latitude: number;
    longitude: number;
  }) => {
    await this.prisma.$connect();
    const res = await this.prisma.companies.create({
      data: {
        name: input.name,
        branch_id: input.branch_id,
        full_address: input.full_address,
        phone: input.phone,
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });
    await this.prisma.$disconnect();
    return res;
  };

  updateCompany = async (input: {
    id: number;
    name?: string;
    branch_id?: number;
    full_address?: string;
    phone?: number;
    latitude?: number;
    longitude?: number;
  }) => {
    // Im too lazy to write all data fields :)
    const dbData = await this.prisma.companies.findUnique({
      where: {
        id: input.id,
      },
    });
    this.prisma.$connect();
    const res = await this.prisma.companies.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name || dbData?.name,
        branch_id: input.branch_id || dbData?.branch_id,
        full_address: input.full_address || dbData?.full_address,
        phone: input.phone || dbData?.phone,
        latitude: input.latitude || dbData?.latitude,
        longitude: input.longitude || dbData?.longitude,
      },
    });

    await this.prisma.$disconnect();
    return res;
  };

  deleteCompany = async (id: number) => {
    await this.prisma.$connect();
    let res = await this.prisma.companies.findUnique({
      where: {
        id: id,
      },
    });

    if (!Object.keys(res).length) {
      return "deleted";
    }

    res = await this.prisma.companies.delete({
      where: {
        id: id,
      },
    });
    await this.prisma.$disconnect();
    return "deleted";
  };

  getCompanies = async () => {
    await this.prisma.$connect();
    const res = await this.prisma.companies.findMany();
    await this.prisma.$disconnect();

    return res;
  };
}

class Express {
  public app = express();
  public port = 3000;
  private prisma = new PrismaDb();

  constructor() {}

  async init() {
    // I hate cors....

    this.app.set("view engine", "html");
    this.app.engine("html", function (path, options, callback) {
      fs.readFile(path, "utf-8", callback);
    });
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(function (req, res, next) {
      cors(req, res, next);
    });

    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });

    await this.expressGetCompanies();
    await this.expressCreateCompany();
    await this.expressUpdateCompany();
    await this.expressDeleteCompany();
    await this.expresGetUser();
    await this.expressReact();

    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  validate = (schema: any) => async (req: any, res: any, next: any) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      return res.status(500).json({ type: err.name, message: err.message });
    }
  };

  async expressGetCompanies() {
    await this.app.get("/api/read", async (req: any, res: any) => {
      const companies = await this.prisma.getCompanies();

      //   return toJson(companies);
      res.status(200).send(toJson(companies));
    });
  }

  async expressCreateCompany() {
    const linkSchema = yup.object({
      body: yup.object({
        name: yup.string().required(),
        branch_id: yup.number().required(),
        full_address: yup.string().required(),
        phone: yup.number().required(),
        latitude: yup.number().required(),
        longitude: yup.number().required(),
      }),
    });

    await this.app.post(
      "/api/create",
      bodyParser.json(),
      this.validate(linkSchema),
      async (req: any, res: any) => {
        const { name, branch_id, full_address, phone, latitude, longitude } =
          req.body;

        console.log(req.body);
        const company = await this.prisma.createCompany({
          name,
          branch_id,
          full_address,
          phone,
          latitude,
          longitude,
        });
        res.status(200).send(toJson(company));
      }
    );
  }

  async expressUpdateCompany() {
    const linkSchema = yup.object({
      body: yup.object({
        id: yup.number().required(),
        name: yup.string(),
        branch_id: yup.number(),
        full_address: yup.string(),
        phone: yup.number(),
        latitude: yup.number(),
        longitude: yup.number(),
      }),
    });

    await this.app.put(
      "/api/update",
      bodyParser.json(),
      this.validate(linkSchema),
      async (req: any, res: any) => {
        const {
          id,
          name,
          branch_id,
          full_address,
          phone,
          latitude,
          longitude,
        } = req.body;

        const company = await this.prisma.updateCompany({
          id,
          name,
          branch_id,
          full_address,
          phone,
          latitude,
          longitude,
        });
        res.status(200).send(toJson(company));
      }
    );
  }

  async expressDeleteCompany() {
    const linkSchema = yup.object({
      body: yup.object({
        id: yup.number().required(),
      }),
    });

    await this.app.delete(
      "/api/delete",
      bodyParser.json(),
      this.validate(linkSchema),
      async (req: any, res: any) => {
        const { id } = req.body;

        const company = await this.prisma.deleteCompany(id);
        res.status(200).send(toJson(company));
      }
    );
  }

  async expresGetUser() {
    const linkSchema = yup.object({
      body: yup.object({
        name: yup.string().required(),
      }),
    });

    await this.app.post(
      "/api/user",
      bodyParser.json(),
      this.validate(linkSchema),
      async (req: any, res: any) => {
        const { name } = req.body;

        const user = await this.prisma.getUser(name);
        res.status(200).send(toJson(user));
      }
    );
  }

  async expressReact() {
    const path = require("path");
    this.app.use(express.static(path.join(__dirname, "../react/build")));

    this.app.get("*", (_, res) => {
      res.sendFile(path.join(__dirname, "../react/build"), "index.html");
    });
  }
}

(async () => {
  const express = await new Express();
  await express.init();
})();
