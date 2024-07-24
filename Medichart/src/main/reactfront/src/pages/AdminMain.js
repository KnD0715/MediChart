import React, { useState, useEffect } from "react";
import styles from "./mymedicheck.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const AdminMain = () => {
  const [data, setData] = useState([]);

  const getWeeklySignupData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/weekly-visitor-count"
      );
      const rawData = response.data;

      // 날짜 생성 함수
      const generateDateLabels = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };

      // 데이터 변환
      const formattedData = rawData.map((value, index) => ({
        name: generateDateLabels(index),
        방문자: value,
      }));

      setData(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Error fetching weekly visitor data:", error);
    }
  };

  useEffect(() => {
    getWeeklySignupData();
  }, []);
  return (
      <div className={styles.container}>
        <div className={styles.sectionLeft}>
          <h2 className={styles.side}>관리자 페이지</h2>
          <div id="line">
            <ul>
              <li>
                <Link to="/admin/noticeList" style={{textDecoration: "none"}} className="link">
                  - 공지사항 관리
                </Link>
              </li>
              <li>
                <Link to="/adminNoticeList" style={{textDecoration: "none"}} className="link">
                  - 문의사항 관리
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div style={{flex: 1, marginLeft: "10px"}}>
          <div className="chart-container" style={{marginTop: "140px"}}>
            <div style={{textAlign: "right", marginBottom: "10px"}}>
              <Link to="/admin/main" className={styles.button}>
                오늘/
              </Link>
              <Link to="/admin/month" className={styles.button}>
                월별/
              </Link>
              <Link to="/admin/year" className={styles.button}>
                연도별
              </Link>
            </div>
            <ResponsiveContainer width="80%" height={600}>
              <LineChart
                  data={data}
                  margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="방문자" stroke="#8884d8"/>
                <Line type="monotone" dataKey="문의사항" stroke="#82ca9d"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
};

export default AdminMain;
