
import img from"../assets/image.png"
import FarmStatsCards from "./farmstate-card";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <img
                src={img}
                alt="Bangladesh Welfare Agro"
                
                className="object-contain"
              />

            <div>
              <FarmStatsCards></FarmStatsCards>
            </div>
           
     
      
    </div>
  );
}
