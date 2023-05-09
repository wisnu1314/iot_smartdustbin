import React from "react";
import {
  Box,
  Text,
  Input,
  Button,
  InputLeftAddon,
  Select,
  InputGroup,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { Inter } from "next/font/google";
import { useEffect, useState, useCallback } from "react";
import axiosFetch from "@/lib/axios";
import Sussy from "./Sussy.svg";
import client from "../mqtt/index";

client.on("connect", function () {
  client.subscribe("durationOn", function (err: any) {
    if (err) {
      console.log(err.message);
    }
    console.log();
  });
  client.subscribe("dataStatus", function (err: any) {
    if (err) {
      console.log(err.message);
    }
  });
});
client.on("message", async function (topic: any, message: any) {
  // message is Buffer
  // console.log(topic);
  if (topic === "durationOn") {
    console.log(message.toString("utf-8"));
  }
});
const susicon = require("./Sussy.svg") as string;
const datax = ["https://bit.ly/Saikyou", "https://bit.ly/SekaiSaikyou"];
const inter = Inter({ subsets: ["latin"] });
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const DeviceRate = (id: string) => {
  return (
    <Box
      display="flex"
      justifyContent="space-around"
      flexDirection="column"
      w="90%"
      h="60%"
      border="0.5vh solid"
      borderColor="black"
      borderRadius={20}
    >
      <Box display="flex" justifyContent="center">
        <InputGroup paddingX={5} gap={20} size="lg">
          <InputLeftAddon w="50%">
            <Text textColor="black">Full Rate</Text>
          </InputLeftAddon>
          <Input w="50%" disabled defaultValue={"1000"}></Input>
        </InputGroup>
      </Box>
      <Box display="flex" justifyContent="center">
        <InputGroup paddingX={5} gap={20} size="lg">
          <InputLeftAddon w="50%">
            <Text textColor="black">Predicted Full Rate</Text>
          </InputLeftAddon>
          <Input w="50%" disabled defaultValue={"1000"}></Input>
        </InputGroup>
      </Box>
      <Box display="flex" justifyContent="center"></Box>
    </Box>
  );
};
const Dashboard = () => {
  const [mqttInput, setMqttInput] = useState("30000");
  const [dataFetched, setDataFetched] = useState(null);
  const [device, setDevice] = useState("dustbin_1");

  const fetchData = useCallback(() => {
    axiosFetch.get("api/data").then((res) => setDataFetched(res.data));
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // const dataxx = "https://bit.ly/Saikyou";
  console.log("Data", dataFetched);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      style={{ background: "white" }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        border="1vh solid"
        borderColor="black"
        borderRadius={20}
        backgroundColor="white"
        minW="100%"
        minH="100%"
        w="800px"
        h="800px"
        alignItems="center"
        bottom={0}
        lineHeight="100%"
        gap={10}
        paddingX={4}
        backgroundImage={
          device === "dustbin_2"
            ? datax[0]
            : device === "dustbin_3"
            ? datax[1]
            : ""
        }
        backgroundClip="content-box"
        backgroundRepeat="no-repeat"
        backgroundSize="100px 100px"
      >
        <ResponsiveContainer width="30%" height="50%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="30%" height="50%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
          gap={20}
          w="20%"
          h="95%"
          border="0.5vh solid"
          borderColor="black"
          borderRadius={20}
          background="green"
        >
          <Select
            paddingTop={20}
            w="full"
            icon={Sussy}
            background="yellow"
            textColor="black"
            defaultValue="1"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            <option value="dustbin_1">Marcel Dustbin</option>
            <option value="dustbin_2">Bintang Dustbin</option>
            <option value="dustbin_3">Fahkry Dustbin</option>
          </Select>

          {DeviceRate(device)}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={20}
          w="20%"
          h="95%"
          border="0.5vh solid"
          borderColor="black"
          borderRadius={20}
          background="green"
        >
          <Text
            fontFamily={inter.className}
            textColor="black"
            fontWeight="bold"
            fontSize={20}
          >
            MQTT Period
          </Text>
          <Input
            value={mqttInput}
            type="number"
            min={3000}
            step={500}
            onChange={(e: any) => setMqttInput(e.target.value)}
            placeholder="30000"
            size="lg"
            textColor="black"
            w="95%"
          />
          <Button
            background="yellow"
            border="5px solid"
            borderColor="black"
            borderRadius={20}
            w="95%"
            h="30px"
          >
            <Text
              fontFamily={inter.className}
              textColor="black"
              fontWeight="bold"
            >
              Submit
            </Text>
          </Button>
        </Box>
      </Box>
    </main>
  );
};
export default Dashboard;
