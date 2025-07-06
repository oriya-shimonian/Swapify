import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ButtonLink from "../ButtonLink";
import { Link, useNavigate } from "react-router-dom";
import AppButton from "../Buttons/AppButton";

const testimonials = [
  {
    name: "נועה כהן",
    position: "משתמשת מרוצה",
    review: "SWAPIFY שינה לי את הדרך שבה אני מחליפה ספרים ופאזלים! כל כך נוח ויעיל.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "איתי גטה",
    position: "חובב משחקי קופסה",
    review: "תהליך ההחלפה קל ומסודר. הממשק פשוט ונוח לשימוש.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "מאיה רוזן",
    position: "אמא לילדים",
    review: "מצאתי כאן קהילה מדהימה שמחליפה פריטים באמינות ובקלות!",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    name: "דניאל כץ",
    position: "אספן פאזלים",
    review: "אפליקציה מעולה! פתרון נהדר למי שאוהב לחדש את האוסף שלו.",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    name: "שני ברקוביץ'",
    position: "סטודנטית",
    review: "סוף סוף דרך מסודרת ונוחה להחליף משחקים עם אחרים!",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    name: "אלון חזן",
    position: "חובב ספרים",
    review: "מצאתי כאן ספרים נדירים שלא הצלחתי למצוא בחנויות. פשוט מדהים!",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg"
  }
];

export default function Recommendations() {
  const navigate = useNavigate();
  return (
    <section className="h-screen md:min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 dark:text-gray-300 text-center px-8 py-16">
      
      {/* כותרת */}
      <div className="max-w-4xl mx-auto mb-12">
        <h3 className="text-4xl font-bold text-gray-900 dark:text-white leading-snug">
          מה המשתמשים שלנו אומרים?
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          הצטרפו לאלפי משתמשים שמחליפים ספרים, פאזלים ומשחקי קופסה בקלות ובביטחון
        </p>
      </div>

      {/* קרוסלת ההמלצות */}
      <Carousel className="w-full max-w-5xl">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="basis-1/3 p-4">
              <Card className="shadow-lg border-none dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-16 h-16 mb-4">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-gray-700 dark:text-gray-300 text-sm italic">{testimonial.review}</p>
                    <h4 className="text-lg font-semibold mt-2">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="disabled:text-gray-400 disabled:dark:text-gray-700 text-gray-800 dark:text-gray-500"/>
        <CarouselNext className="disabled:text-gray-400 disabled:dark:text-gray-700 text-gray-800 dark:text-gray-500"/>
      </Carousel>

      {/* הצטרפות לקהילה */}
      <div className="mt-20 text-center">
        <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
          הצטרפו לקהילה שלנו עוד היום!
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          עולם של ספרים, פאזלים ומשחקים מחכה לכם. הירשמו עכשיו!
        </p>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <AppButton onClick={() => navigate("/login")}>הירשמו עכשיו</AppButton>
          <Button variant="outline" asChild>
            <Link to="/about"  className="px-6 py-[1.37rem] rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-x-105 text-black dark:text-white" >למידע נוסף </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
