import { Request, Response } from "express";
import { deleteUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();

		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const deletedUser = await deleteUserById(id);

		return res.status(200).json(deletedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
};
