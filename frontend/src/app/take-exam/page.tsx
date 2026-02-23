"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Card, Typography } from "antd";
import { useRouter } from "next/navigation";
import { fetchAllExams } from "@/services/examService";
import { ExamItem } from "@/data/examsData";

const { Title } = Typography;

export default function TakeExamList() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        // Fetch exams. If student, backend filters based on role usually?
        // Or pass studentId if API supports.
        // For now fetch all available (VietSign fetchAllExams logic typically gets accessible ones)
        const data = await fetchAllExams({ studentId: user?.id });
        setExams(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  const columns = [
    {
      title: "Làm bài kiểm tra - VietSignSchool",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Loại",
      dataIndex: "examType",
      key: "examType",
      render: (type: string) => {
        let color = "blue";
        if (type === "PRACTICE") color = "purple";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ExamItem) => (
        <Button
          type="primary"
          onClick={() => router.push(`/take-exam/${record.id}`)}
          className="bg-blue-600"
        >
          Làm bài
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6">
        Danh sách bài kiểm tra
      </Title>
      <Card className="rounded-xl shadow-sm">
        <Table
          dataSource={exams}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
}
