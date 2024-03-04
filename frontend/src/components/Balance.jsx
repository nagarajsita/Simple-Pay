export const Balance = ({ value }) => {
    return (
      <>
        <hr className="border-t-2 border-blue-900 my-4" />
        <div className="flex items-center justify-around bg-blue-100 p-4 rounded-md">
          <div className="text-lg text-blue-900 font-semibold">
            Your balance
          </div>
          <div className="text-2xl text-black font-bold">Rs {value}</div>
        </div>
        <hr className="border-t-2 border-gray-300 my-4" />
      </>
    );
  };
  