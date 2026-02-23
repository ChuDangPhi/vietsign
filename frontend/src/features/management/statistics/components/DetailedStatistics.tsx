"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Spin,
  Row,
  Col,
  Statistic,
  Empty,
  Typography,
  List,
  Avatar,
  Badge,
  Tag,
} from "antd";
import {
  BookOpen,
  Video,
  LogIn,
  Clock,
  ArrowLeft,
  History,
} from "lucide-react";
import { fetchUserById } from "@/services/userService";
import Learning from "@/model/Learning";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export function DetailedStatistics({ userId }: { userId: string }) {
  const router = useRouter();

  const { data: userData, isFetching: isFetchingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(Number(userId)),
    enabled: !!userId,
  });

  const { data: statsData, isFetching: isFetchingStats } = useQuery({
    queryKey: ["statistics", userId],
    queryFn: () => Learning.leaningProcess(Number(userId)),
    enabled: !!userId,
  });

  if (isFetchingUser || isFetchingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return <Empty description="Không tìm thấy thông tin học viên này." />;
  }

  const user = userData;
  const stats = statsData || { lessonViews: [], vocabularyViews: [] };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <Title level={4} className="!mb-0">
            Chi tiết tiến độ học tập: {user.name}
          </Title>
          <Text type="secondary">{user.email}</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24} lg={8}>
          <Card
            title="🎯 Thông tin Học viên"
            bordered={false}
            className="shadow-sm h-full rounded-xl"
          >
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={80}
                src={user.avatar || undefined}
                className="bg-blue-100 text-blue-600 font-bold mb-4"
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Title level={5} className="!mb-1">
                {user.name}
              </Title>
              <Badge
                status={user.isDeleted ? "error" : "success"}
                text={user.isDeleted ? "Đã khóa" : "Hoạt động"}
              />
            </div>

            <Descriptions column={1} size="small" className="mt-4">
              <Descriptions.Item label="SĐT">
                {user.phone || "Trống"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Lớp học">
                {user.organizationName || "Chưa phân lớp"}
              </Descriptions.Item>
              <Descriptions.Item label="Trường">
                {user.parentOrganizationName || "Trống"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {user.createdAt || "Trống"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card
                bordered={false}
                className="shadow-sm rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50"
              >
                <Statistic
                  title="📑 Tổng bài học đã xem"
                  value={stats.lessonViews?.length || 0}
                  prefix={<BookOpen className="w-5 h-5 mr-2 text-blue-500" />}
                  valueStyle={{ color: "#3b82f6", fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                bordered={false}
                className="shadow-sm rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50"
              >
                <Statistic
                  title="🧩 Tổng từ vựng đã học"
                  value={stats.vocabularyViews?.length || 0}
                  prefix={<Video className="w-5 h-5 mr-2 text-purple-500" />}
                  valueStyle={{ color: "#a855f7", fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                bordered={false}
                className="shadow-sm rounded-xl"
                title={
                  <span className="flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-500" /> Hoạt động gần
                    đây
                  </span>
                }
              >
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Text strong className="text-gray-600 block mb-3">
                      Bài học xem gần đây
                    </Text>
                    {stats.lessonViews?.length > 0 ? (
                      <List
                        size="small"
                        dataSource={stats.lessonViews.slice(0, 5)}
                        renderItem={(item: any) => (
                          <List.Item className="border-b-0 py-2">
                            <div className="flex items-center w-full justify-between">
                              <span>
                                ID Bài học:{" "}
                                <Tag color="blue">{item.lesson_id}</Tag>
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  item.last_viewed_at,
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có lượt xem bài học nào"
                      />
                    )}
                  </Col>

                  <Col span={12}>
                    <Text strong className="text-gray-600 block mb-3">
                      Từ vựng xem gần đây
                    </Text>
                    {stats.vocabularyViews?.length > 0 ? (
                      <List
                        size="small"
                        dataSource={stats.vocabularyViews.slice(0, 5)}
                        renderItem={(item: any) => (
                          <List.Item className="border-b-0 py-2">
                            <div className="flex items-center w-full justify-between">
                              <span>
                                ID Từ vựng:{" "}
                                <Tag color="purple">{item.vocabulary_id}</Tag>
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  item.last_viewed_at,
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa xem từ vựng nào"
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
