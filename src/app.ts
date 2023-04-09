import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/test", (request, reply) => {
  return reply.send({ message: "Hello" });
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Server running on ${address}`);
});
