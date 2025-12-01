declare const gsap: any;
declare const ScrollTrigger: any;

type GsapGlobal = typeof window & {
  gsap?: any;
  ScrollTrigger?: any;
};

export function getGsap(): any | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const globalWindow = window as GsapGlobal;
  return globalWindow.gsap ?? (typeof gsap !== 'undefined' ? gsap : null);
}

export function getScrollTrigger(): any | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const globalWindow = window as GsapGlobal;
  return globalWindow.ScrollTrigger ?? (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null);
}
