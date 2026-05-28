import { FastifyInstance } from 'fastify';

export async function contactRoutes(server: FastifyInstance) {
  server.post('/', async (request, reply) => {
    const data = request.body;

    console.log('Новое сообщение:', data);

    return reply.send({
      success: true,
      message: 'Сообщение отправлено',
    });
  });
}




