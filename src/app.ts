import express, { Request, Response } from "express";
import { prismaClient } from "./utils/db";

const PORT = 3200;
const app =express();

app.use(express.json());

app.get("/user-data/list", async (req: Request, res: Response) => {
  try {
    const findUsers = await prismaClient.user.findMany();

    const userMaps = findUsers.map( u => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));

    res.json(userMaps);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal error"});
  }
});

app.post("/user-data", async (req: Request, res: Response) => {
  try {    
    const {name, email, password} = req.body;

    const findUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if(findUser) return res.status(400).json({message: "El usuario ya existe"});


    const data = await prismaClient.user.create({
      data: {
        name, email, password,
      }
    });

    const { password:_, ...rest } = data;

    res.json(rest);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal error"});
  }
});

app.put("/user-data/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {name, email} = req.body;

    const findUser = await prismaClient.user.findUnique({
      where: { email, NOT: { id: Number(id) } },
    });

    if(findUser) return res.status(400).json({message: "Ya existe un usuario con este email"});

    const findUserUpdate = await prismaClient.user.update({
      where: { id: Number(id) },
      data: {
        name, email,
      }
    });
    
    const { password:_, ...rest } = findUserUpdate;

    res.json(rest);

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal error"});
  }
});

app.delete("/user-data/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    const findUser = await prismaClient.user.findUnique({
      where: { id: Number(id) },
    });

    if(!findUser) return res.status(400).json({message: "El usuario no existe"});


    const deleteUser = await prismaClient.user.delete({
      where: { id: Number(id) },
    });

    const { password:_, ...rest } = deleteUser;

    res.json({
      message: "Usuario eliminado",
      user: rest
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal error"});
  }
});



async function main(){
  console.log('Inicando servidor...');

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });

}

main();