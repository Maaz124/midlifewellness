export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  keywords: string[];
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "perimenopause-symptoms",
    title: "Understanding Perimenopause Symptoms: What Every Woman Needs to Know",
    excerpt: "From hot flashes to mood swings, learn how to identify and manage the early signs of perimenopause.",
    content: `
      <h2>The Transition Begins</h2>
      <p>Perimenopause, the period leading up to menopause, can start as early as your mid-30s or as late as your late 40s. It's a time of significant hormonal flux, and for many women, the symptoms can be confusing and disruptive.</p>
      
      <h3>Common Symptoms to Watch For</h3>
      <ul>
        <li><strong>Irregular Periods:</strong> Often the first sign, cycles may become shorter or longer.</li>
        <li><strong>Hot Flashes & Night Sweats:</strong> Sudden waves of heat that can disrupt sleep and daily life.</li>
        <li><strong>Mood Changes:</strong> Increased irritability, anxiety, or even bouts of low mood.</li>
        <li><strong>Sleep Disturbances:</strong> Insomnia or waking up feeling unrefreshed.</li>
        <li><strong>Brain Fog:</strong> Difficulty concentrating or remembering things.</li>
      </ul>

      <h3>Why It Happens</h3>
      <p>The primary cause is the fluctuating levels of estrogen and progesterone produced by the ovaries. As the body prepares to cease menstruation, these fluctuations can trigger various physical and emotional responses.</p>

      <h3>Managing the Transition</h3>
      <p>While perimenopause is a natural phase of life, you don't have to suffer through it. Lifestyle changes, nutrition, and stress management play a crucial role in balancing hormones naturally.</p>
    `,
    author: "Dr. Sidra Bukhari",
    date: "March 10, 2026",
    keywords: ["perimenopause symptoms", "hormone health", "midlife wellness"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "midlife-weight-gain",
    title: "The Truth About Midlife Weight Gain and How to Reverse It",
    excerpt: "Why the scale keeps climbing in your 40s and 50s, and the science-backed strategies to reclaim your body.",
    content: `
      <h2>The 'Menopause Middle'</h2>
      <p>Many women notice that weight starts settling around their midsection during perimenopause and menopause, even if their diet and exercise habits haven't changed. This is often frustrating and can affect self-esteem.</p>
      
      <h3>Why Does This Happen?</h3>
      <p>Several factors contribute to weight gain during this stage:</p>
      <ul>
        <li><strong>Hormonal Shifts:</strong> Dropping estrogen levels change how your body stores fat.</li>
        <li><strong>Loss of Muscle Mass:</strong> Sarcopenia (muscle loss) slows down your metabolism.</li>
        <li><strong>Insulin Resistance:</strong> Hormonal changes can make your body less efficient at processing sugar.</li>
        <li><strong>Stress (Cortisol):</strong> High stress levels trigger fat storage, particularly in the abdomen.</li>
      </ul>

      <h3>Strategies for Success</h3>
      <p>Focusing purely on 'calories in vs calories out' often fails during midlife. Instead, focus on:</p>
      <ol>
        <li><strong>Strength Training:</strong> Rebuild muscle to boost your metabolism.</li>
        <li><strong>Protein Intake:</strong> Aim for higher protein to support muscle and satiety.</li>
        <li><strong>Stress Management:</strong> Lowering cortisol is key to unlocking fat loss.</li>
      </ol>
    `,
    author: "Dr. Sidra Bukhari",
    date: "March 5, 2026",
    keywords: ["midlife weight gain", "menopause belly", "metabolism"],
    image: "/images/blog/midlife_weight_gain.png"
  },
  {
    slug: "hormone-balance",
    title: "Naturally Balanced: 5 Steps to Restore Hormone Harmony",
    excerpt: "Restore your energy, clear your skin, and stabilize your mood with these holistic hormone-balancing tips.",
    content: `
      <h2>Hormones Rule Your Life</h2>
      <p>From your energy levels to your appetite and your sex drive, hormones are the chemical messengers that run the show. When they are out of sync, everything feels 'off'.</p>
      
      <h3>Step 1: Eat for Your Hormones</h3>
      <p>Focus on healthy fats (avocados, nuts), fiber, and cruciferous vegetables like broccoli and cauliflower which help your liver detoxify 'dirty' estrogens.</p>

      <h3>Step 2: Prioritize Sleep</h3>
      <p>Your hormones recalibrate while you sleep. Lack of sleep spikes ghrelin (the hunger hormone) and drops leptin (the fullness hormone).</p>

      <h3>Step 3: Mindful Movement</h3>
      <p>Overtraining can actually crash your hormones in midlife. Shift from high-intensity cardio to more yoga, walking, and manageable weight lifting.</p>

      <h3>Step 4: Reduce Environmental Toxins</h3>
      <p>Endocrine disruptors in plastics and some skincare products can mimic estrogen in the body. Switch to 'clean' alternatives where possible.</p>

      <h3>Step 5: Connection and Joy</h3>
      <p>Oxytocin, the 'cuddle hormone', is a powerful stabilizer for other hormones. Spend time with loved ones and engage in hobbies that bring you peace.</p>
    `,
    author: "Dr. Sidra Bukhari",
    date: "February 28, 2026",
    keywords: ["hormone balance", "natural healing", "wellness tips"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "menopausal-insomnia-sleep-tips",
    title: "How to End Menopausal Insomnia and Night Sweats for Better Sleep",
    excerpt: "Struggling with '3 AM wakefulness' and temperature spikes? Discover the science of midlife sleep and how to fix it.",
    content: `
      <h2>The 3 AM Wake-Up Call</h2>
      <p>If you're finding yourself staring at the ceiling in the middle of the night, you're not alone. Sleep disturbances are one of the most common complaints during perimenopause and menopause, affecting up to 60% of women.</p>

      <h3>Why Your Sleep Is Changing</h3>
      <p>The decline in <strong>progesterone</strong> — our natural anti-anxiety and sleep-inducing hormone — is often the culprit. Additionally, low estrogen can trigger the hypothalamus to 'misfire', leading to night sweats that wake you up in a soak.</p>

      <h3>3 Proven Rituals for Midlife Sleep</h3>
      <ul>
        <li><strong>Temperature Mapping:</strong> Keep your room between 60-67°F (15-19°C). Use bamboo or linen sheets that wick moisture away during a night sweat.</li>
        <li><strong>The Magnesium Connection:</strong> Magnesium glycinate is a 'miracle' mineral for many midlife women, helping to calm the nervous system before bed.</li>
        <li><strong>Digital Sunsets:</strong> Blue light suppresses melatonin. Turn off screens 90 minutes before bed and opt for a physical book or meditation instead.</li>
      </ul>

      <p>Remember, sleep is the foundation of hormone balance. When you don't sleep, your cortisol stays high, which then makes your menopause symptoms worse the next day.</p>
    `,
    author: "Dr. Sidra Bukhari",
    date: "March 18, 2026",
    keywords: ["menopausal insomnia", "night sweats relief", "sleep in menopause", "progesterone for sleep"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
  },
  {
    slug: "midlife-brain-fog-remedies",
    title: "Reclaim Your Focus: 7 Science-Backed Ways to Combat Midlife Brain Fog",
    excerpt: "Feel like you're losing your edge? Learn why brain fog happens during the transition and how to sharpen your mind again.",
    content: `
      <h2>It's Not 'Early Onset'—It's Hormonal</h2>
      <p>Difficulty finding words, forgetting why you walked into a room, or feeling like your brain is wrapped in cotton wool — these are the hallmarks of midlife brain fog. While it can feel scary, it is almost always a temporary result of hormonal shifts.</p>

      <h3>The Estrogen-Brain Connection</h3>
      <p>Estrogen is a key fuel for the brain. It helps neurons communicate and encourages blood flow to the areas responsible for memory and executive function. As estrogen levels dip, the brain has to find new ways to process energy, creating that'sticky' feeling in your thoughts.</p>

      <h3>How to Sharpen Your Clarity</h3>
      <ol>
        <li><strong>Anti-Inflammatory Nutrition:</strong> Omega-3 fatty acids (found in walnuts, chia, and wild-caught fish) are literal brain food.</li>
        <li><strong>Cognitive Strength Training:</strong> Use it or lose it! Learning a new skill or language creates new neural pathways that bypass the fog.</li>
        <li><strong>Stress Buffering:</strong> High cortisol is toxic to the hippocampus (your memory center). Even 5 minutes of deep breathing can protect your recall.</li>
        <li><strong>Hydration:</strong> Even 1% dehydration can significantly impact focus and memory tasks.</li>
      </ol>

      <p>Through our Mind Reset Method coaching, we specifically target the neuroplasticity of the midlife brain to help you perform at your peak again.</p>
    `,
    author: "Dr. Sidra Bukhari",
    date: "March 19, 2026",
    keywords: ["midlife brain fog", "menopause memory loss", "cognitive health women", "focus in perimenopause"],
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=1200"
  }
];
