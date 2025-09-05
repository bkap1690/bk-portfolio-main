// Placeholder images (replace with real images as needed)
const images = [
  "https://placehold.co/300x150?text=1",
  "https://placehold.co/300x150?text=2",
  "https://placehold.co/300x150?text=3",
  "https://placehold.co/300x150?text=4",
  "https://placehold.co/300x150?text=5",
  "https://placehold.co/300x150?text=6",
  "https://placehold.co/300x150?text=7",
  "https://placehold.co/300x150?text=8",
  "https://placehold.co/300x150?text=9",
];

export default function BentoGrid() {
  return (
    <div className="mx-auto h-[800px] w-full max-w-full">
      <div className="grid-rows-auto grid h-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-4">
        {/* Box 1: Tall vertical on top left */}
        <div className="col-span-1 row-span-1 md:row-span-2 flex items-center justify-center  md:text-6xl text-2xl font-medium leading-snug tracking-wider text-text-primary dark:text-text-primary shadow-md bg-white">
          The 
          <br />
          Solution
        </div>
        {/* Box 2: Center block top left */}
        <div className="order-1 col-span-1 row-span-1 overflow-hidden  shadow-md">
          <img
            src={images[0]}
            alt="Bento 1"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 3: Center block top right */}
        <div className="order-2 col-span-1 row-span-1 overflow-hidden  shadow-md">
          <img
            src={images[1]}
            alt="Bento 2"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 4: Block top right */}
        <div className="relative order-3 overflow-hidden  md:col-span-1 md:row-span-2 shadow-md">
          <img
            src={images[2]}
            alt="Bento 3"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 5: Center block bottom left */}
        <div className="order-4 overflow-hidden  col-span-1 row-span-1 md:row-span-2 lg:col-span-2 shadow-md">
          <img
            src={images[3]}
            alt="Bento 4"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 6: Center block bottom right */}
        <div className="order-5 flex items-center justify-center overflow-hidden  col-span-1 row-span-1 md:row-span-2 shadow-md">
          <img
            src={images[4]}
            alt="Bento 5"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 7: Block bottom right */}
        <div className="order-6 overflow-hidden  col-span-1 row-span-1 shadow-md">
          <img
            src={images[5]}
            alt="Bento 6"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 8: Block bottom center */}
        <div className="order-7 overflow-hidden  col-span-1 row-span-1 shadow-md">
          <img
            src={images[6]}
            alt="Bento 7"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Box 9: Block bottom left */}
        <div className="order-8 overflow-hidden  col-span-1 row-span-1 md:col-span-3 lg:col-span-2 shadow-md">
          <img
            src={images[7]}
            alt="Bento 8"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
