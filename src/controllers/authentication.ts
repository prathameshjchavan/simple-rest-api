import { createUser, getUserByEmail } from "../db/users";
import { Request, Response } from "express";
import { random, authentication } from "../helpers";

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) return res.status(400).send("Bad Request");

		const user = await getUserByEmail(email).select(
			"+authentication.salt +authentication.password"
		);

		if (!user) return res.status(404).send("User Not found");

		const expectedHash = authentication(user.authentication.salt, password);

		if (user.authentication.password !== expectedHash)
			return res.status(403).send("Wrong Password");

		const salt = random();
		user.authentication.sessionToken = authentication(
			salt,
			user._id.toString()
		);

		await user.save();

		res.cookie("AUTH", user.authentication.sessionToken, {
			domain: "localhost",
			path: "/",
		});

		return res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Internal Server Error");
	}
};

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
