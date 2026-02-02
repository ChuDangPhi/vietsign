import { Base } from "./base";

export class GameModel extends Base {
  constructor() {
    super("games");
  }

  getAllGames = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getGameById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  createGame = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  updateGame = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteGame = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };
}

const Games = new GameModel();
export default Games;
