/**
 * Whether analytics runs without asking.
 *
 * Set NEXT_PUBLIC_ANALYTICS_DEFAULT_ON=true and Google Analytics loads for
 * everyone with no consent banner. Unset, or anything else, and nothing loads
 * until a visitor says yes — which is the behaviour this site has had since the
 * 4 Sep correction, and the behaviour /privacy currently describes.
 *
 * ONE SWITCH, TWO PLACES, DELIBERATELY.
 *
 * The banner and the privacy page both read this. That is the whole point of it
 * being here rather than a line edited in the component: /privacy tells visitors,
 * in specific terms, that the script is not loaded and no cookie is set until
 * they allow it. Turning analytics on by default without changing that sentence
 * does not just process personal information under POPIA without consent — it
 * makes a published statement on the site untrue, which is the exact failure
 * AIC certifies other organisations against, on the site making the claim.
 *
 * That version of section 9 has been wrong once already: it used to say the
 * site ran Vercel Analytics and set no tracking cookies while it was running
 * Google Analytics. Wiring both to one flag means it cannot silently drift out
 * of step a second time.
 */
export const ANALYTICS_DEFAULT_ON =
  process.env.NEXT_PUBLIC_ANALYTICS_DEFAULT_ON === "true";
