"use client";

import React, { useState } from "react";
import { Table, Input, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/services/userService";
import { fetchAllClasses } from "@/services/classService";
import { fetchAllOrganizations } from "@/services/organizationService";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";

export function StatisticsManagement() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Simple debounce for search
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data: userData, isFetching: isFetchingUsers } = useQuery({
    queryKey: [
      "users",
      "student",
      debouncedSearchText,
      selectedClass,
      selectedSchool,
      currentPage,
    ],
    queryFn: () =>
      fetchAllUsers({
        role: "STUDENT",
        search: debouncedSearchText,
        classRoomId: selectedClass,
        schoolId: selectedSchool,
        page: currentPage,
        limit: pageSize,
      }),
  });

  const { data: classesData } = useQuery({
    queryKey: ["classes"],
    queryFn: () => fetchAllClasses(),
  });

  const { data: schoolsData } = useQuery({
    queryKey: ["schools"],
    queryFn: () => fetchAllOrganizations(),
  });

  const classOptions =
    classesData?.map((c) => ({ label: c.name, value: c.id })) || [];
  const schoolOptions =
    schoolsData?.map((s) => ({ label: s.name, value: s.id })) || [];

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="text-lg font-medium">{text}</div>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "organizationName", // This might need adjustment based on real API response
      key: "classroom",
      render: (text: string) => (
        <div className="text-lg">{text || "Không có"}</div>
      ),
    },
    {
      title: "Trường",
      key: "school",
      render: (record: any) => (
        <div className="text-lg">
          {record.parentOrganizationName || "Không có"}
        </div>
      ), // Assuming parentOrganizationName map to school
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <div className="text-lg">{text || "Không có"}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <div className="text-lg">{text || "Không có"}</div>
      ),
    },
  ];

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h1 className="mb-4 text-2xl font-bold">Danh sách học sinh</h1>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          allowClear
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm tên học sinh"
          prefix={<SearchIcon className="w-4 h-4 text-gray-400" />}
          className="w-full md:w-96"
        />

        <div className="flex gap-2 w-full md:w-auto">
          <Select
            placeholder="Lọc theo lớp"
            options={classOptions}
            allowClear
            onChange={(value) => {
              setSelectedClass(value);
              setCurrentPage(1);
            }}
            className="w-full md:w-48"
          />
          <Select
            placeholder="Lọc theo trường"
            options={schoolOptions}
            allowClear
            onChange={(value) => {
              setSelectedSchool(value);
              setCurrentPage(1);
            }}
            className="w-full md:w-48"
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={userData?.users || []}
        loading={isFetchingUsers}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            router.push(`/statistics/${record.id}`);
          },
          className: "cursor-pointer hover:bg-gray-50",
        })}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: userData?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
}
