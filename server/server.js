const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 4000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
const serviceKey =
  "0srIUU5Wn0iDAAhOS72fq0TJUFvD2MDVa9Z2Xv6%2F6Cm6lDCz1bSd19TY%2FxdIIq0jXrDoJS01Vya%2BSpQDgeXu5A%3D%3D";
const url = `http://api.odcloud.kr/api/EvInfoServiceV2/v1/getEvSearchList?serviceKey=${serviceKey}`;

app.get("/aa", async (req, res) => {
  const { search } = req.query;
  await axios({
    url: url,
    params: { ...search, "cond[addr::LIKE]": search.text },
  })
    .then(({ data }) => {
      console.log(data);
      const result = {
        currentCount: data.currentCount,
        matchCount: data.matchCount,
        totalCount: data.totalCount,
        page: data.page,
        data: [],
      };
      const cpTp = [
        "B타입(5핀)",
        "C타입(5핀)",
        "BC타입(5핀)",
        "BC타입(7핀)",
        "DC차 데모",
        "AC 3상",
        "DC콤보",
        "DC차데모+DC콤보",
        "DC차데모+AC3상",
        "DC차데모+DC콤보, AC3상",
      ];
      const cpStat = [
        "충전가능",
        "충전중",
        "고장/점검",
        "통신장애",
        "통신미연결",
      ];
      data.data.forEach((item) => {
        const data = {
          addr: item.addr,
          stationName: item.csNm,
          chargerName: item.cpNm,
          chargingType: cpTp[Number(item.cpTp) - 1],
          chargerType: item.chargeTp === "1" ? "완속" : "급속",
          chargerState: cpStat[Number(item.cpStat) - 1],
          lat: item.lat,
          longi: item.longi,
          lastUpdate: item.statUpdatetime,
        };
        result.data.push(data);
      });
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log("서버켜짐");
});
