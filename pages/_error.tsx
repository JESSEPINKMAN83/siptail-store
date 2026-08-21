import type { NextPageContext } from "next";
function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign:"center", padding:"4rem 1rem" }}>
      <h1 style={{ fontSize:"2rem", fontWeight:"bold" }}>{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>
      <p style={{ color:"#666", marginTop:"1rem" }}><a href="/" style={{ color:"#2563eb" }}>Go home</a></p>
    </div>
  );
}
Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : (err as {statusCode?: number})?.statusCode ?? 404;
  return { statusCode };
};
export default Error;
