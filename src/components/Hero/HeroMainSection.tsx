import ButtonLink from '../ButtonLink';

const HeroMainSection = () => {
  return (
    <section className="relative h-screen md:min-h-screen bg-[url('/explorePage/mainImage.jpg')] 
      lg:bg-top md:bg-cover bg-[length:100%_100%] md:bg-center bg-no-repeat w-full flex flex-col justify-end pb-12 sm:pb-28 md:pb-28">
      
      {/* Darker Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      {/* Content Section */}
      <div className="relative z-10 flex sm:flex-col md:flex-row-reverse justify-between w-full px-6 md:px-12 sm:px-12 lg:px-20 text-right space-y-4 sm:space-y-0 md:space-y-0 sm:items-center md:items-center">
        
        {/* כותרת בצד ימין */}
        <p className="text-2xl sm:text-2xl md:text-5xl font-bold md:text-white max-w-md md:max-w-lg lg:max-w-xl leading-tight self-end md:self-auto">
          החלף את מה שיש לך במה שאתה באמת רוצה
        </p>

        {/* כפתור בצד שמאל (באותו גובה כמו הכותרת ב-md) */}
        <div className="w-full sm:w-auto md:w-auto flex justify-start md:items-center">
          <ButtonLink to="/login">החלף עכשיו</ButtonLink>
        </div>

      </div>
    </section>
  );
};

export default HeroMainSection;
