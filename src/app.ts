import express, { Request, Response } from "express";

const PORT = 3200;
const app =express();

app.get("/user-data", (req: Request, res: Response) => {
  const data = {
    name: "Juanito Alimana",
    email: "juanito@alimana.ve",
    password: "NoEnviarElPassword",
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});