import React, { useState } from "react";
import { LayoutDashboard, UserPlus, QrCode, InspectIcon } from "lucide-react";

const features = [
  {
    title: "Organizer Dashboard",
    description:
      "Centralized tools for event creation, attendee insights, and real-time analytics dashboard. Get a comprehensive view of your events with our intuitive dashboard. Monitor ticket sales, track attendance patterns, and access detailed analytics to make data-driven decisions. Features include customizable widgets, exportable reports, and real-time updates.",
    icon: LayoutDashboard,
    image: "/Dashboard.svg",
  },
  {
    title: "User Registration",
    description:
      "Streamlined registration with social logins and automatic QR code generation for attendees. Simplify the registration process with our user-friendly system. Offer multiple sign-up options including social media integration, custom form fields, and automated email confirmations. Generate unique QR codes instantly for each attendee.",
    icon: UserPlus,
    image: "/Registration.svg",
  },
  {
    title: "Check-In/Check-Out",
    description:
      "Real-time QR-based tracking system with instant notifications and attendance monitoring. Manage event access efficiently with our QR-based system. Track attendee flow in real-time, receive instant alerts for VIP arrivals, and generate attendance reports on the go. Includes offline mode support and multi-device synchronization.",
    icon: QrCode,
    image: "/check-in.svg",
  },
  {
    title: "Dynamic Badge Design",
    description:
      "Create professional badges with our intuitive design tool. Choose from a variety of templates, customize layouts, and generate badges in bulk. Supports variable data printing and multiple export formats for seamless event management.",
    icon: InspectIcon,
    image: "/id.svg",
  },
];

export const AIFeatures = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  return (
    <section className="py-24 px-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced tools for seamless event management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the future of event management with our advanced,
            cutting-edge features.{" "}
          </p>
        </div>

        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isExpanded = expandedFeature === index;
          const truncatedDescription = isExpanded
            ? feature.description
            : feature.description.split(".")[0] + ".";

          return (
            <div key={index}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8 ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="space-y-6">
                      <Icon className="w-12 h-12 text-[#6B46C1]" />
                      <h3 className="text-3xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-gray-600">
                        {truncatedDescription}
                      </p>
                      <button
                        onClick={() =>
                          setExpandedFeature(isExpanded ? null : index)
                        }
                        className="bg-[#319795] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2C7A7B] transition"
                      >
                        {isExpanded ? "Show Less" : "Learn More"}
                      </button>
                    </div>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-3/4 mx-auto"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-3/4 mx-auto"
                    />
                    <div className="space-y-6">
                      <Icon className="w-12 h-12 text-[#6B46C1]" />
                      <h3 className="text-3xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-gray-600">
                        {truncatedDescription}
                      </p>
                      <button
                        onClick={() =>
                          setExpandedFeature(isExpanded ? null : index)
                        }
                        className="bg-[#319795] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2C7A7B] transition"
                      >
                        {isExpanded ? "Show Less" : "Learn More"}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="mb-24" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
