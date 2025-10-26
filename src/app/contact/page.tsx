'use client';

import { useState } from 'react';
import { Typewriter } from '@/components/ui/typewriter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ButtonGradient } from '@/components/ui/button-gradient';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construct mailto link with form data
    const mailtoLink = `mailto:nxgennxx@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message and reset form
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Contact Us",
              "Get In Touch",
              "Reach Out",
              "Say Hello"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We&apos;d love to hear from you. Reach out to us with any questions or feedback.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-background/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Mail className="w-5 h-5 text-primary" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:nxgennxx@gmail.com"
                className="text-primary hover:underline break-all"
              >
                nxgennxx@gmail.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                We&apos;ll respond within 24-48 hours
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <MessageSquare className="w-5 h-5 text-primary" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Connect with us on social platforms
              </p>
              <a
                href="/socials"
                className="text-primary hover:underline"
              >
                View all social links →
              </a>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Operating globally, serving the future
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-background/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-background/50 resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                    ✓ Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                    ✗ Failed to send message. Please try again or email us directly.
                  </div>
                )}

                <ButtonGradient
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </ButtonGradient>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We typically respond to inquiries within 24-48 hours during business days.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interested in collaborating? We&apos;d love to hear your ideas and proposals.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Technical Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For technical issues, please include detailed information in your message.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your feedback helps us improve. We welcome all suggestions and comments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
    
