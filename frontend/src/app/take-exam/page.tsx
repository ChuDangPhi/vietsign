"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Card, Typography } from "antd";
import { useRouter } from "next/navigation";
import { fetchAllExams } from "@/services/examService";
import { ExamItem } from "@/data/examsData";
import { DashboardLayout } from "@/shared/components/layout";

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
        const data = await fetchAllExams({
          studentId: user?.id || user?.user_id,
        });
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
      title: "Trạng thái / Điểm",
      key: "status_score",
      render: (_: any, record: ExamItem) => {
        if (!record.isSubmitted) return <Tag>Chưa làm</Tag>;
        const scoreDisplay =
          record.userScore !== undefined && record.userScore !== null
            ? `${record.userScore} điểm`
            : "Đã nộp";
        return <Tag color="green">{scoreDisplay}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ExamItem) => {
        const isQuiz =
          record.examType === "QUIZ" ||
          (record.examType as string) === "MULTIPLE_CHOICE";

        if (isQuiz && record.isSubmitted) {
          return (
            <Button disabled className="bg-gray-200">
              Đã làm
            </Button>
          );
        }

        return (
          <Button
            type="primary"
            onClick={() => router.push(`/take-exam/${record.id}`)}
            className="bg-blue-600"
          >
            Làm bài
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}
