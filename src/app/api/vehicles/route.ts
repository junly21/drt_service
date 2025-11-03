import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json(); // 현재는 body 미사용

    // 인라인 목 데이터 (차량 목록)
    const mockData = [
      {
        차량번호: "11가1234",
        권역: "전라남도",
        운수사: "목포시내버스",
        차량종류: "버스",
        차량상태: "운행중",
        제조사: "현대",
        모델명: "뉴 슈퍼 에어로시티",
        출고년도: "2020",
        연료형태: "CNG",
        비고: "",
      },
      {
        차량번호: "22나5678",
        권역: "전라남도",
        운수사: "여수시내버스",
        차량종류: "버스",
        차량상태: "정지",
        제조사: "기아",
        모델명: "그랜버드",
        출고년도: "2019",
        연료형태: "디젤",
        비고: "정기점검",
      },
      {
        차량번호: "33다9012",
        권역: "전라남도",
        운수사: "완도시내버스",
        차량종류: "버스",
        차량상태: "운행중",
        제조사: "현대",
        모델명: "뉴 슈퍼 에어로시티",
        출고년도: "2021",
        연료형태: "전기",
        비고: "",
      },
      {
        차량번호: "44라3456",
        권역: "전라남도",
        운수사: "목포시내버스",
        차량종류: "버스",
        차량상태: "정지",
        제조사: "기아",
        모델명: "그랜버드",
        출고년도: "2018",
        연료형태: "CNG",
        비고: "사고수리중",
      },
    ];

    return NextResponse.json(
      { vehicles: mockData, total: mockData.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
