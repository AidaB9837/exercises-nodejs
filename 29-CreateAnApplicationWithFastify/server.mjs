import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  reply.send({ data: "This server up&running with Fastify!" });
});

try {
  await fastify.listen({ port: 3000 });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
