"use client";
import { useGetApartmentByIdsQuery, useGetUserByIdQuery } from "@/features/api";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Home, MapPin, User, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddFavorite from "../components/AddFavorite";
import Button from "../components/Button";

export default function ViewFavorites() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const { data: userById } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const userInfo = Array.isArray(userById) ? userById[0] : userById;

  const { data: favorites } = useGetApartmentByIdsQuery(userInfo?.favorites, {
    skip: !userInfo?.favorites?.length,
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 min-h-screen sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-600 hover:text-emerald-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>

        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">My Favorites</h2>
              <p className="text-slate-500 mt-2">
                {favorites?.length || 0}{" "}
                {favorites?.length === 1 ? "apartment" : "apartments"} saved
              </p>
            </div>
          </div>

          {/* Если нет избранных */}
          {(!favorites || favorites.length === 0) ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Star className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No favorites yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Save apartments you like, and they will appear here.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
              >
                Browse Apartments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites?.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Картинка */}
                  <div className="relative">
                    <Image
                      src={apt.images[0].imageName ?? "/no-picture.webp"}
                      alt={apt.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                      <AddFavorite userId={user?.id} apartmentId={apt.id}/>
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="px-6 py-5">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {apt.title}
                    </h3>
                    <p className="text-slate-500 mb-4">{apt.description}</p>

                    <div className="space-y-3 text-slate-700 text-sm mb-6">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 text-emerald-600 mr-3" />
                        <span>{apt.rooms} rooms • {apt.area} m²</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-emerald-600 mr-3" />
                        <span>{apt.district || "Unknown district"}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-emerald-600 mr-3" />
                        <span>{apt.maxPeople} people max</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <p className="text-lg font-semibold text-emerald-600">
                        ${apt.price}
                      </p>
                      <Button size="sm"
                        onClick={() => router.push(`/ApartmentDetail/${apt.id}`)}
                      >
                        View Apartment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
