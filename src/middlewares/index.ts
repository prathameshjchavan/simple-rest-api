import { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const sessionToken = req.cookies["AUTH"];

		if (!sessionToken) return res.status(403).send("Unauthorized");

		const existingUser = await getUserBySessionToken(sessionToken);

		if (!existingUser) return res.status(403).send("Unauthorized");

		merge(req, { identity: existingUser });

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
};
