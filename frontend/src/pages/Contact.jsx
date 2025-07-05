import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate form submission - in a real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just open the user's email client
      const subject = encodeURIComponent(formData.subject || 'Contact Form Submission');
      const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`);
      
      window.open(`mailto:support@healthinsights.com?subject=${subject}&body=${body}`);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 py-10 max-w-[960px] mx-auto flex flex-col gap-16">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div
              className="aspect-video bg-cover bg-center rounded-lg w-full md:w-1/2"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYkcV9l1g9Aigafs2LCqHAaWLHlwTNC9xf7qXc31a99W1KF2qorhTIMkE5_e-RTDL3owcxbvCjOWqHtMf0zWgW3ZLvKnFRVToNK7YiIcITW3kcm_JUemHpfwdQ-8otMi9aTc4CMD1PlROQ5dh4-43pYCeTPNR3dNFjQyBHkaF00WaLgC3rz5s_zfveOfYif5BqrEeWJ3hIC1OPk_6SE1z_8ltEQ30bZb_X88bnv5cKpqRbx9-uTFZxoLmCoNCDj08Ccr9bpJ2XwdI')",
              }}
            ></div>
            <div className="flex flex-col gap-6 md:w-1/2">
              <h1 className="text-4xl font-black text-[#0d141c]">
                Get in Touch
              </h1>
              <p className="text-base text-[#0d141c]">
                We're here to help you understand your health better. Reach out to us anytime.
              </p>
            </div>
          </div>

          {/* Contact Form and Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[#0d141c] text-sm font-medium block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-[#cedbe8] bg-white text-[#0d141c] placeholder-[#49739c] focus:outline-none focus:ring-2 focus:ring-[#248bf3] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-[#0d141c] text-sm font-medium block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-[#cedbe8] bg-white text-[#0d141c] placeholder-[#49739c] focus:outline-none focus:ring-2 focus:ring-[#248bf3] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="text-[#0d141c] text-sm font-medium block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-[#cedbe8] bg-white text-[#0d141c] placeholder-[#49739c] focus:outline-none focus:ring-2 focus:ring-[#248bf3] focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="text-[#0d141c] text-sm font-medium block mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-[#cedbe8] bg-white text-[#0d141c] placeholder-[#49739c] focus:outline-none focus:ring-2 focus:ring-[#248bf3] focus:border-transparent resize-none"
                    placeholder="Tell us more about your question or concern..."
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    Message sent successfully! Your email client should open shortly.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    There was an error sending your message. Please try again.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#248bf3] text-white font-bold rounded-lg h-12 px-6 text-base hover:bg-[#0c7ff2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-[#0d141c] text-[32px] font-bold leading-tight mb-4">
                  Contact Information
                </h2>
                <p className="text-[#49739c] text-base font-normal leading-normal">
                  We're available to help you with any questions or concerns about your health analysis.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <ContactInfo
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z" />
                    </svg>
                  }
                  title="Phone"
                  info="+1 (555) 123-4567"
                  desc="Available Monday - Friday, 9AM - 6PM EST"
                />

                <ContactInfo
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05L172,164H84Zm46.74-10.85L216,74.19V181.81Z" />
                    </svg>
                  }
                  title="Email"
                  info="support@healthinsights.com"
                  desc="We'll respond within 24 hours"
                />

                <ContactInfo
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128ZM176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM184,216a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8Z" />
                    </svg>
                  }
                  title="Address"
                  info="123 Health Street, Medical District"
                  desc="New York, NY 10001"
                />
              </div>

              <div className="bg-white rounded-lg border border-[#cedbe8] p-6">
                <h3 className="text-[#0d141c] text-lg font-bold mb-3">
                  Business Hours
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#49739c]">Monday - Friday</span>
                    <span className="text-[#0d141c] font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#49739c]">Saturday</span>
                    <span className="text-[#0d141c] font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#49739c]">Sunday</span>
                    <span className="text-[#0d141c] font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, title, info, desc }) => (
  <div className="flex gap-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#e7edf4] text-[#248bf3]">
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-[#0d141c] text-lg font-bold">{title}</h3>
      <p className="text-[#0d141c] text-sm font-medium">{info}</p>
      <p className="text-[#49739c] text-sm">{desc}</p>
    </div>
  </div>
);

export default Contact; 