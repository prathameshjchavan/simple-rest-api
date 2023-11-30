import { createUser, getUserByEmail } from "db/users";
import { Request, Response } from "express";
import { random, authentication } from "helpers";

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body;

		if (!email || !password || !username)
			return res.status(400).send("Bad Request");

		const existingUser = await getUserByEmail(email);

		if (existingUser) return res.status(400).send("User Already Exist");

		const salt = random();
		const user = await createUser({
			email,
			username,
			authentication: { salt, password: authentication(salt, password) },
		});

		return res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Internal Server Error");
	}
};
