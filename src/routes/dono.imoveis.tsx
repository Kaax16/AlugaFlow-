import { Outlet, createFileRoute } from "@tanstack/react-router";

// Rota de layout de "Imóveis": serve apenas de contêiner para a listagem
// (rota índice) e para a página de detalhe (/dono/imoveis/$id), que é
// renderizada aqui pelo <Outlet />.
export const Route = createFileRoute("/dono/imoveis")({
  component: () => <Outlet />,
});
