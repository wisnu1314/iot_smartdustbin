/* eslint-disable react-hooks/exhaustive-deps */
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
import nodemailer from "nodemailer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const DeviceRate = (props: {
  id: string;
  startDate: Date;
  setStartDate: (selectedStart: Date) => void;
  endDate: Date;
  setEndDate: (selectedEnd: Date) => void;
  groupby: string;
  setGroupBy: (selectedGroup: string) => void;
  dustbin: any[];
  setDustbin: (dustbin: any[]) => void;
  setDustbin1: (dustbin1: any[]) => void;
  setDustbin2: (dustbin2: any[]) => void;
  setFiltered: (filtered: boolean) => void;
}) => {
  // console.log("props", props.startDate);
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
      <Box display="flex" justifyContent="center" zIndex={0}>
        <InputGroup paddingX={5} gap={20} size="lg">
          <InputLeftAddon w="50%">
            <Text textColor="black">Group By</Text>
          </InputLeftAddon>
          <Select
            w="full"
            icon={Sussy}
            background="yellow"
            textColor="black"
            defaultValue="none"
            value={props.groupby}
            onChange={(e: any) => props.setGroupBy(e.target.value)}
          >
            <option value="none">None</option>
            <option value="day">Day</option>
            <option value="hour">Hour</option>
            <option value="minute">Minute</option>
          </Select>
        </InputGroup>
      </Box>
      <Box display="flex" justifyContent="center" zIndex={0}>
        <InputGroup paddingX={5} gap={20} size="lg">
          <InputLeftAddon w="50%">
            <Text textColor="black">Filter Start Date</Text>
          </InputLeftAddon>
          <Box w="50%" textColor="black">
            <DatePicker
              dateFormat="dd/MM/yyyy hh:mm"
              selected={props.startDate}
              onChange={(date: Date) => {
                props.setStartDate(date);
                if (date.getTime() > props.endDate.getTime()) {
                  props.setEndDate(date);
                }
              }}
              showTimeSelect
            />
          </Box>
        </InputGroup>
      </Box>
      <Box display="flex" justifyContent="center" zIndex={0}>
        <InputGroup paddingX={5} gap={20} size="lg">
          <InputLeftAddon w="50%">
            <Text textColor="black">Filter End Date</Text>
          </InputLeftAddon>
          <Box w="50%" textColor="black">
            <DatePicker
              dateFormat="dd/MM/yyyy hh:mm"
              selected={props.endDate}
              onChange={(date: Date) => {
                props.setEndDate(date);
                if (date.getTime() < props.startDate.getTime()) {
                  props.setStartDate(date);
                }
              }}
              showTimeSelect
            />
          </Box>
        </InputGroup>
      </Box>
      <Button
        background="yellow"
        border="5px solid"
        borderColor="black"
        borderRadius={20}
        w="95%"
        h="30px"
        zIndex={0}
        onClick={(e) => {
          e.preventDefault();

          axiosFetch
            .get(
              `/data?start=${props.startDate.toISOString()}&end=${props.endDate.toISOString()}`
            )
            .then((res) => {
              props.setDustbin(res.data.data);
              const temp = res.data.data;

              const temp1 = temp.filter((d: any) => {
                return d.id.includes("dustbin_1");
              });
              const temp2 = temp.filter((d: any) => {
                return d.id.includes("dustbin_2");
              });
              props.setDustbin1(temp1);
              props.setDustbin2(temp2);
              props.setFiltered(true);
            });
        }}
      >
        <Text fontFamily={inter.className} textColor="black" fontWeight="bold">
          Apply
        </Text>
      </Button>
    </Box>
  );
};
const Dashboard = () => {
  const [mqttInput, setMqttInput] = useState("30000");
  const [dataFetched, setDataFetched] = useState<any>({ data: [] });
  const [device, setDevice] = useState("dustbin_1");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFiltered, setIsFiltered] = useState(false);
  const [groupby, setGroupby] = useState("day");
  const [dustbin1, setDustbin1] = useState<any[]>([]);
  const [dustbin2, setDustbin2] = useState<any[]>([]);
  const [filteredDustbin, setFilteredDustbin] = useState<any[]>([]);
  const [filteredDustbin1, setFilteredDustbin1] = useState<any[]>([]);
  const [filteredDustbin2, setFilteredDustbin2] = useState<any[]>([]);
  const fetchDustbinData = useCallback(() => {
    axiosFetch.get("/data").then((res) => setDataFetched(res.data));
  }, []);
  const fetchDustbinMQTT = useCallback(() => {
    axiosFetch.get("/status").then((res) => {
      if (res.data.data) {
        const mqtt = res.data.data?.find((f: any) => f.id === device);
        //console.log("dustbin", mqtt.period);
        setMqttInput(String(mqtt.period));
      }
    });
  }, [device]);
  // const groupingData = useCallback(() => {
  //   // var temp1 = [];
  //   // var temp2 = []
  //   if (dataFetched) {
  //     const temp1 = dataFetched.data.filter((d: any) => {
  //       return d.id.includes("dustbin_1");
  //     });
  //     const temp2 = dataFetched.data.filter((d: any) => {
  //       return d.id.includes("dustbin_2");
  //     });
  //     setDustbin1(temp1);
  //     setDustbin2(temp2);
  //   }
  // }, [dataFetched]);
  useEffect(() => {
    fetchDustbinData();
    fetchDustbinMQTT();
  }, []);

  useEffect(() => {
    if (dataFetched.data.length !== 0) {
      const temp1 = dataFetched.data.filter((d: any) => {
        return d.id.includes("dustbin_1");
      });
      const temp2 = dataFetched.data.filter((d: any) => {
        return d.id.includes("dustbin_2");
      });
      setDustbin1(temp1);
      setDustbin2(temp2);
    }
  }, [dataFetched]);
  // const dataxx = "https://bit.ly/Saikyou";
  // console.log("Data", dustbin1, dustbin2);
  console.log("Data", filteredDustbin1, filteredDustbin2);
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
        // w="100%"
        h="750px"
        alignItems="center"
        alignSelf="center"
        bottom={0}
        lineHeight="100%"
        gap={10}
        paddingX={4}
        // backgroundImage={
        //   device === "dustbin_2"
        //     ? datax[0]
        //     : device === "dustbin_1"
        //     ? datax[1]
        //     : ""
        // }
        backgroundClip="content-box"
        backgroundRepeat="no-repeat"
        backgroundSize="100px 100px"
      >
        <ResponsiveContainer width="30%" height="50%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            data={
              device === "dustbin_1" && isFiltered
                ? filteredDustbin1
                : device === "dustbin_2" && isFiltered
                ? filteredDustbin2
                : device === "dustbin_1"
                ? dustbin1
                : dustbin2
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" label="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="volume" stroke="#8884d8" />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="30%" height="50%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            data={
              device === "dustbin_1" && isFiltered
                ? filteredDustbin1
                : device === "dustbin_2" && isFiltered
                ? filteredDustbin2
                : device === "dustbin_1"
                ? dustbin1
                : dustbin2
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" label="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
          gap={20}
          w="30%"
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
            onChange={(e: any) => setDevice(e.target.value)}
          >
            <option value="dustbin_1">Fahkry Dustbin</option>
            <option value="dustbin_2">Bintang Dustbin</option>
          </Select>
          <DeviceRate
            id={device}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            groupby={groupby}
            setGroupBy={setGroupby}
            dustbin={filteredDustbin}
            setDustbin={setFilteredDustbin}
            setDustbin1={setFilteredDustbin1}
            setDustbin2={setFilteredDustbin2}
            setFiltered={setIsFiltered}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={20}
          w="10%"
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
            zIndex={0}
            onClick={(e) => {
              e.preventDefault();
              const updateMqttPeriod = async () => {
                const resp = await axiosFetch.put("/status", {
                  period: Number(mqttInput),
                  id: device,
                });

                return resp.data;
              };
              updateMqttPeriod().then((msg: any) => {
                alert(msg.message);
              });
            }}
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
