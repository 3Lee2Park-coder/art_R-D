import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap max-w-[980px] py-16">
      <h1 className="display">페이지를 찾을 수 없습니다.</h1>
      <Link href="/" className="btn btn-primary mt-8">
        홈으로
      </Link>
    </div>
  );
}
