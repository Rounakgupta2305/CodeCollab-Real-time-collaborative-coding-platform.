import Form from "./Form";
function Home() {
  return (
    <div className="flex min-h-screen items-center">
        <div className="my-10 flex h-full min-w-full flex-col items-center sm:pt-0">

            <div className="flex justify-center sm:w-1/2 sm:pl-4">
                <img src="/images/logo.svg" alt="logo" className="mx-auto w-[250px] sm:w-[400px] animate-pulse"/> 
            </div>
            <div className="flex w-full items-center justify-center sm:w-1/2">
                <Form/>
            </div>

        </div>
    </div>
  );
}

export default Home;
