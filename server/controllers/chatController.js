const https = require("https");

exports.chat = async (req, res) => {
  const { message, systemPrompt, subject, mode } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // ── If OpenAI key is configured, use it ──────────────────
  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const payload = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt || `You are an expert AI tutor for South Sudan secondary school students (Senior 1-4). 
Subject: ${subject || "General"}. Mode: ${mode || "learn"}.
Explain clearly, use examples, and relate to the South Sudan curriculum.
Be encouraging, supportive, and use step-by-step explanations.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const options = {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const openaiReq = https.request(options, (openaiRes) => {
        let data = "";
        openaiRes.on("data", (chunk) => (data += chunk));
        openaiRes.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              return res.status(500).json({ error: parsed.error.message });
            }
            const reply = parsed.choices?.[0]?.message?.content || "No response from AI.";
            res.json({ response: reply });
          } catch {
            res.status(500).json({ error: "Failed to parse OpenAI response." });
          }
        });
      });

      openaiReq.on("error", (err) => {
        res.status(500).json({ error: "OpenAI request failed: " + err.message });
      });

      openaiReq.write(payload);
      openaiReq.end();
      return;
    } catch (err) {
      // Fall through to smart fallback
    }
  }

  // ── Smart local fallback (no API key needed) ─────────────
  const m = message.toLowerCase();
  const subjectContext = subject && subject !== "Any Subject" ? ` in ${subject}` : "";

  const responses = {
    photosynthesis: `**Photosynthesis**${subjectContext}\n\nPhotosynthesis is the process by which green plants make food using sunlight.\n\n**Equation:** 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1. Chlorophyll absorbs sunlight\n2. Water is split (photolysis) — releases O₂\n3. CO₂ is fixed into glucose\n\n**Exam tip:** Always state the equation and name the organelle (chloroplast).`,
    algebra: `**Algebra**${subjectContext}\n\n**Solving equations:** Do the same operation to both sides.\nExample: 3x + 7 = 22 → 3x = 15 → x = 5\n\n**Quadratic formula:** x = (–b ± √(b²–4ac)) / 2a\n\n**Factorisation:** x² + 5x + 6 = (x+2)(x+3)\n\n**Step-by-step tip:** Always check your answer by substituting back.`,
    newton: `**Newton's Laws of Motion**${subjectContext}\n\n**1st Law:** Objects stay at rest or in motion unless a net force acts.\n**2nd Law:** F = ma (Force = mass × acceleration)\n**3rd Law:** Every action has an equal and opposite reaction.\n\n**Example:** F=ma → m=5kg, a=3m/s² → F=15N\n\n**Exam tip:** State the law, give the formula, apply to an example.`,
    cell: `**Cell Biology**${subjectContext}\n\n**Animal cell:** Nucleus, Mitochondria, Ribosome, Cell membrane, Cytoplasm\n**Plant cell extras:** Cell wall (cellulose), Chloroplasts, Large vacuole\n\n**Key processes:**\n- Diffusion: high → low concentration (no energy)\n- Osmosis: water through semi-permeable membrane\n- Active transport: against gradient (needs ATP)\n\n**Exam tip:** Know the differences between plant and animal cells.`,
    demand: `**Demand & Supply**${subjectContext}\n\n**Law of Demand:** Price rises → quantity demanded falls\n**Law of Supply:** Price rises → quantity supplied rises\n**Equilibrium:** Where demand = supply\n\n**Shifts in demand:** Income changes, taste changes, substitute prices\n**Shifts in supply:** Input costs, technology, number of producers\n\n**Exam tip:** Always draw a supply-demand diagram in your answer.`,
    essay: `**Essay Writing**${subjectContext}\n\n**Structure (PEEL):**\n- **P**oint: Topic sentence stating your argument\n- **E**vidence: Facts, examples, quotations\n- **E**xplanation: Analyse the evidence\n- **L**ink: Connect back to the thesis\n\n**Introduction:** Hook → Background → Thesis\n**Conclusion:** Restate thesis → Summarise → Final thought\n\n**Exam tip:** Plan for 5 minutes before writing. Quality over quantity.`,
  };

  for (const [key, reply] of Object.entries(responses)) {
    if (m.includes(key)) {
      let finalReply = reply;
      if (mode === "practice") finalReply += "\n\n**Practice:** Write a 3-sentence explanation of this topic in your own words.";
      if (mode === "exam") finalReply += "\n\n**Exam Prep:** This is a common exam topic. Memorise the key formula/definition and practice applying it.";
      return res.json({ response: finalReply });
    }
  }

  // Generic helpful response
  res.json({
    response: `Great question about **"${message}"**${subjectContext}!\n\nHere's how to approach this topic:\n\n1. **Define** the key terms\n2. **Explain** the main concept with an example\n3. **Apply** it to a real-world situation\n4. **Review** using the module notes and quiz\n\nFor a detailed explanation, open the relevant module in your subject and use the Notes and Q&A tabs. You can also try rephrasing your question for a more specific answer!\n\n💡 **Tip:** Add your OpenAI API key to server/.env as OPENAI_API_KEY=sk-... for full AI responses.`,
  });
};
