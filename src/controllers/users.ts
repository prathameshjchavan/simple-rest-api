import { Request, Response } from "express";
import { getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();

		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
};
