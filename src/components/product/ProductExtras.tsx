import { motion } from "framer-motion";
import { Star, Play, ImageIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProductData } from "@/data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export const ScreenshotsSection = ({ product }: { product: ProductData }) => {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));
  if (!product.screenshots?.length) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Screenshots</span>
          <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground">See {product.title} in Action</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            A quick tour of the interface — swipe through real workflow screens.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-5xl">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {product.screenshots.map((shot, i) => (
                <CarouselItem key={shot.title + i} className="pl-4 sm:basis-1/2 lg:basis-1/2">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="group rounded-xl border border-border bg-card overflow-hidden card-hover"
                  >
                    {/* Mock window chrome */}
                    <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                      <span className="ml-3 text-[11px] font-medium text-muted-foreground truncate">
                        {product.title} — {shot.title}
                      </span>
                    </div>
                    <div className={`relative aspect-video bg-gradient-to-br ${shot.accent}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-lg bg-background/80 backdrop-blur-sm p-4 shadow-lg">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 rounded-md bg-background/90 backdrop-blur-sm px-3 py-2">
                        <p className="text-xs font-bold text-foreground">{shot.title}</p>
                        <p className="text-[11px] text-muted-foreground">{shot.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
            <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export const VideoSection = ({ product }: { product: ProductData }) => {
  if (!product.videoUrl) return null;
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Product Video</span>
          <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground">Watch the Walkthrough</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            See how {product.title} handles real files in under two minutes.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="mt-12 mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2">
              <Play className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-medium text-muted-foreground">Demo · {product.title}</span>
            </div>
            <video
              controls
              poster={product.videoPoster}
              className="w-full aspect-video bg-black"
              preload="metadata"
            >
              <source src={product.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const ReviewsSection = ({ product }: { product: ProductData }) => {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));
  if (!product.reviews?.length) return null;
  const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Reviews</span>
          <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground">Loved by Professionals Worldwide</h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(avg) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{avg.toFixed(1)}/5</span>
            <span className="text-sm text-muted-foreground">· {product.reviews.length * 612}+ verified reviews</span>
          </div>
        </div>

        <div className="mt-12 mx-auto max-w-5xl">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {product.reviews.map((rev, i) => (
                <CarouselItem key={rev.name + i} className="pl-4 sm:basis-1/2 lg:basis-1/2">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="h-full rounded-xl border border-border bg-card p-6 card-hover"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className={`h-3.5 w-3.5 ${k < rev.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">"{rev.text}"</p>
                    <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full primary-gradient text-primary-foreground text-xs font-bold">
                        {rev.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{rev.name}</p>
                        <p className="text-xs text-muted-foreground">{rev.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
            <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
