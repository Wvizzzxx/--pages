import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { Service } from "../models/Service";
import { authMiddleware, adminGuard } from "../middleware/auth";

export const serviceRoutes = async (fastify: FastifyInstance) => {
  // Get all services (public)
  fastify.get("/", async (request, reply) => {
    const services = await Service.find().sort({ createdAt: -1 });
    return reply.send({ success: true, data: services });
  });

  // Get service by slug (public)
  fastify.get("/:slug", async (request, reply) => {
    const { slug } = request.params as any;
    const service = await Service.findOne({ slug });
    if (!service) {
      return reply
        .status(404)
        .send({ success: false, message: "Услуга не найдена" });
    }
    return reply.send({ success: true, data: service });
  });

  // Get all services (admin)
  fastify.get(
    "/admin/all",
    { preHandler: [authMiddleware, adminGuard] },
    async (request, reply) => {
      const services = await Service.find().sort({ createdAt: -1 });
      return reply.send({ success: true, data: services });
    },
  );

  // Create service (admin)
  fastify.post(
    "/",
    { preHandler: [authMiddleware, adminGuard] },
    async (request, reply) => {
      try {
        const body = request.body as any;
        const service = await Service.create(body);
        return reply.status(201).send({ success: true, data: service });
      } catch (error) {
        return reply
          .status(500)
          .send({ success: false, message: "Ошибка создания услуги" });
      }
    },
  );

  // Update service (admin)
  const updateServiceHandler = async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const body = request.body;
      const service = await Service.findByIdAndUpdate(id, body, { new: true });
      if (!service) {
        return reply
          .status(404)
          .send({ success: false, message: "Услуга не найдена" });
      }
      return reply.send({ success: true, data: service });
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, message: "Ошибка обновления услуги" });
    }
  };

  fastify.put(
    "/:id",
    { preHandler: [authMiddleware, adminGuard] },
    updateServiceHandler,
  );
  fastify.patch(
    "/:id",
    { preHandler: [authMiddleware, adminGuard] },
    updateServiceHandler,
  );

  // Delete service (admin)
  fastify.delete(
    "/:id",
    { preHandler: [authMiddleware, adminGuard] },
    async (request, reply) => {
      try {
        const { id } = request.params as any;
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
          return reply
            .status(404)
            .send({ success: false, message: "Услуга не найдена" });
        }
        return reply.send({ success: true, message: "Услуга удалена" });
      } catch (error) {
        return reply
          .status(500)
          .send({ success: false, message: "Ошибка удаления услуги" });
      }
    },
  );
};
