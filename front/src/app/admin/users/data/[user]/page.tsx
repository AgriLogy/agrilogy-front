type Params = {
	user: string;
  };
  
  export default function Lala({ params }: { params: Params }) {
	const { user } = params; // Destructure here if needed
  
	return <h1>dsqsqsqds {user}</h1>;
  }
  