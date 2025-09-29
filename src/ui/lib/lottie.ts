import lottie from "lottie-web";
export function mountLottie(el: HTMLElement, path: string, loop=true) {
  return lottie.loadAnimation({ container: el, renderer: "svg", loop, autoplay: true, path });
}
