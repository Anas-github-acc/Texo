import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return ( 
    <div className="flex justify-center items-center min-h-screen">
      <p>Hello
       <Button><Link href='/documents/123'>Hello</Link></Button>
      </p></div>
  );
}
 
export default Home;