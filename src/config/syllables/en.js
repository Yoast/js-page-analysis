module.exports = {
	vowels: "aeiouy",
	deviations: {
		vowels: [
			{
				fragments: [ "cial", "tia", "cius", "giu", "ion",
					"[^bdnprv]iou", "sia$", "[^aeiuot]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$",
					"[a-z]ely$", "[cgy]ed$", "rved$", "[aeiouy][dt]es?$", "eau", "ieu",
					"oeu", "[aeiouy][^aeiouydt]e[sd]?$", "[aeouy]rse$", "^eye" ],
				countModifier: -1,
			},
			{
				fragments: [ "ia", "iu", "ii", "io", "[aeio][aeiou]{2}", "[aeiou]ing", "[^aeiou]ying", "ui[aeou]" ],
				countModifier: 1,
			},
			{
				fragments: [ "^ree[jmnpqrsx]", "^reele", "^reeva", "riet",
					"dien", "[aeiouym][bdp]le$", "uei", "uou",
					"^mc", "ism$", "[^l]lien", "^coa[dglx].",
					"[^gqauieo]ua[^auieo]", "dn't$", "uity$", "ie(r|st)",
					"[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$" ],
				countModifier: 1,
			},
			{
				fragments: [ "eoa", "eoo", "ioa", "ioe", "ioo" ],
				countModifier: 1,
			},
		],
		words: {
			full: [
				{
					word: "business",
					syllables: 2,
				},
				{
					word: "coheiress",
					syllables: 3,
				},
				{
					word: "colonel",
					syllables: 2,
				},
				{
					word: "heiress",
					syllables: 2,
				},
				{
					word: "i.e",
					syllables: 2,
				},
				{
					word: "shoreline",
					syllables: 2,
				},
				{
					word: "simile",
					syllables: 3,
				},
				{
					word: "unheired",
					syllables: 2,
				},
				{
					word: "wednesday",
					syllables: 2,
				},
			],
			fragments: {
				global: [
					{
						word: "coyote",
						syllables: 3,
					},
					{
						word: "graveyard",
						syllables: 2,
					},
					{
						word: "lawyer",
						syllables: 2,
					},
				],
			},
		},
	},
};
