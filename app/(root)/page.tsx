import Link from "next/link";

export default function Home() {
  return (
    <div>
      Home Page
      <br />
      <br />
      <br />
      <Link href={"/theory"}>TheoryPage</Link>
    </div>
  );
}
