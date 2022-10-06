import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin)
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });

    //compute DB summary
    const users = readUsersDB();
    const userCount = users.filter((x) => x.isAdmin === false).length;
    const adminCount = users.filter((x) => x.isAdmin === true).length;
    const totalMoney = users
      .filter((x) => x.isAdmin === false)
      .map((x) => x.money)
      .reduce((p, c) => p + c, 0);
    //return response
    return res.json({ ok: true, userCount, adminCount, totalMoney });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
