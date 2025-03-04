// מערך התמונות
const imageUrls = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF2RGkcidnu9RVMoFi3ZSf2B7TTxoMECEi96CHn6J_GFsm5IlzO0E8nx2SMIuOoQY01VE&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkpLJNOmpra9-Ma56SwI2zmkWGYgmmUBxZ3tY-B43j455NM9mSJy61cDPZrbFZ8DR6hRA&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgd-vgVgtjl5d5te6vP8tZJLJe2tMT6xHwgKG1Sg8Wq-qytZ94VHnzSgPc9hBjNIKzdpI&usqp=CAU",
  "https://i.pinimg.com/236x/0c/ee/7e/0cee7e54fda8ac99ec11459448e89c7d.jpg",
  "https://skyryedesign.com/wp-content/uploads/2016/04/56c6f9b7efad5-cover-books-design-illustrations.jpg",
  "https://images.squarespace-cdn.com/content/v1/5fc7868e04dc9f2855c99940/32f738d4-e4b9-4c61-bfc0-e813699cdd3c/laura-barrett-illustrator-beloved-girls-book-cover.jpg?format=1500w",
];

export default function ImageInfinityCaruselStrip({ design, direction }: { design?: string, direction: 'left' | 'right' }) {
    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';
    const fulldirection = direction === 'left' ? 'left-full' : 'right-full';
  return (
<div className=" w-full overflow-hidden bg-transparent">
      {/* קבוצה ראשונה של התמונות */}
      <div className={`flex w-max ${animationClass}`}>
        {imageUrls.map((src, index) => (
          <img key={index} src={src} alt="carousel" className={`lg:w-40 lg:h-40 md:w-28 h:w-28 object-fill mx-2 fulldirection ${design}`} />
        ))}
      </div>
    </div>
  )
}

