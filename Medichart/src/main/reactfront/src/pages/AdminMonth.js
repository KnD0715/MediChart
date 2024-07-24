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

const AdminMonth = () => {
  const [data, setData] = useState([]);

  const getMonthlySignupData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/monthly-visitor-count"
      );
      const rawData = response.data;

      // 날짜 생성 함수
      const generateDateLabels = (monthsAgo) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0-based month index
        return `${year}년 ${month}월`; // '2024년 7월', '2024년 6월', etc.
      };

      // 데이터 변환
      const formattedData = rawData.map((value, index) => ({
        name: generateDateLabels(index),
        방문자: value,
      }));

      setData(formattedData);
      console.log(formattedData); // 데이터가 올바르게 설정되었는지 확인
    } catch (error) {
      console.error("Error fetching monthly visitor data:", error);
    }
  };

  useEffect(() => {
    getMonthlySignupData();
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
        <div style={{flex: 1, marginLeft: "1px"}}>
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
            <ResponsiveContainer width="80%" height={500}>
              <LineChart
                  data={data}
                  margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="방문자" stroke="#8884d8"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
  );
};

export default AdminMonth;
