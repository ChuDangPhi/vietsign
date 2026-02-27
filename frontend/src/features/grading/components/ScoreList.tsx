"use client";

import React, { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Spin } from "antd";
import { useRouter } from "next/navigation";
import { fetchAllPracticalSubmissions } from "@/services/examService";

export default function ScoreList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch real practical submissions
      const submissions = await fetchAllPracticalSubmissions();

      const entries = submissions.map((sub: any) => ({
        examId: sub.exam_id,
        examName: sub.examName || "Bài thực hành",
        examType: "Thực hành",
        classRoomName: sub.classRoomName || "N/A",
        userId: sub.studentId,
        userName: sub.studentName,
        status: "Pending",
        attemptId: sub.attempt_id,
      }));

      setDataList(entries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: "Tên bài kiểm tra",
      dataIndex: "examName",
      key: "examName",
      render: (text: string, record: any) => (
        <a
          onClick={() =>
            router.push(`/grading/${record.examId}/${record.userId}`)
          }
          className="text-blue-600 font-medium"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Loại bài kiểm tra",
      dataIndex: "examType",
      render: () => <Tag color="blue">Thực hành</Tag>,
    },
    {
      title: "Lớp",
      dataIndex: "classRoomName",
    },
    {
      title: "Học sinh",
      dataIndex: "userName",
    },
    {
      title: "Hành động",
      render: (record: any) => (
        <Button
          type="primary"
          onClick={() =>
            router.push(`/grading/${record.examId}/${record.userId}`)
          }
          className="bg-blue-600"
        >
          Chấm điểm
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">
        Danh sách bài kiểm tra thực hành
      </h1>
      <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Input
          placeholder="Tìm theo tên bài kiểm tra"
          style={{ width: 300 }}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          allowClear
        />
        <Button onClick={fetchData}>Tìm kiếm</Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataList.filter((d) =>
          d.examName.toLowerCase().includes(filterName.toLowerCase()),
        )}
        loading={loading}
        rowKey={(r) => `${r.examId}-${r.userId}`}
        pagination={{ pageSize: 10 }}
        className="shadow-sm rounded-lg overflow-hidden"
      />
    </div>
  );
}
