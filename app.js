const {comp, html, render} = hypersimple;

const policy = [
  { category: "Mission Alignment", questions: [
    {text: "Their mission clearly aligns with our mission.", color: "green"},
    {text:"Their activity results in outcomes that align with our mission.", color: "green"},
    {text:"Their user growth reflects an achievement of our mission goals.", color: "green"},
  ]},
  { category: "Methodology", questions: [
    {text: "The collaboration is open source.", color: "green"},
    {text: "The collaboration work will happen in public.", color: "green"},
  ]},
  { category: "Outcomes and Impact", questions: [
    {text: "Results in mass consumer adoption", color: "green"},
    {text: "Results in domain-specific consumer adoption", color: "green"},
    {text: "Results in domain-specific developer adoption", color: "green"},
    {text: "Results in mass developer adoption", color: "green"},
    {text: "Results in domain-specific problem resolution", color: "green"},
    {text: "Results in mission-level problem resolution", color: "green"},
  ]},
  { category: "Project / Ecosystem", questions: [
    {text: "Advances specific project objectives this year", color: "green"},
    {text: "Methodology or tool choice improves our developer or user ecosystem", color: "green"},
    {text: "They are a community member", color: "green"},
  ]},
  { category: "Cultural Alignment", questions: [
    {text: "They are furthering arts and culture", color: "green"},
    {text: "They are focused on archiving and preservation", color: "green"},
    {text: "They are enabling open innovation", color: "green"},
    {text: "They are engaging in research that may help us", color: "green"},
  ]},
  { category: "Ethical Concern", questions: [
    {text: "The org suppresses or constrains the distribution of knowledge.", color: "yellow"},
    {text: "The org centralizes of power/control over individual choice.", color: "yellow"},
    {text: "The org favors growth over mindfulness, or ethics.", color: "yellow"},
  ]},
  { category: "Internal and Community Alignment", questions: [
    {text: "This makes me feel uncomfortable.", color: "yellow"},
    {text: "Some staff might be unhappy at learning about this collaboration.", color: "yellow"},
    {text: "I am concerned that the collaboration could result in a press nightmare.", color: "yellow"},
    {text: "Our biggest fans might be unhappy about this collaboration.", color: "yellow"},
  ]},
  { category: "Anti-alignment - works against our ability to achieve our mission", questions: [
    {text: "Centralizes control of information", color: "red"},
    {text: "Intentionally thwarts a functioning democracy", color: "red"},
    {text: "Intentionally shares incorrect information", color: "red"},
    {text: "The org actively fights an open internet.", color: "red"},
  ]},
  { category: "Moral Repugnance", questions: [
    {text: "The organization is a military.", color: "yellow"},
    {text: "The organization is a state censorship board.", color: "red"},
    {text: "The organization has no content controls for illicit sexual materials, revenge porn, doxxing.", color: "red"},
    {text: "The organization is a hate group, or provides a platform for hate speech.", color: "red"},
    {text: "The organization violates our code of conduct.", color: "red"},
    {text: "The organization engages in, encourages or enables hate speech.", color: "red"},
    {text: "The organization knowingly increases human suffering.", color: "red"},
    {text: "These people are actual Nazis.", color: "red"},
  ]}
];

const PolicyForm = comp(model => html`
  <div class="form">
    ${model.policy.map(Category)}
  </div>
`);

const Category = comp(model => html`
  <div class="category">
    <h3>${model.category}</h3>
    <div>
      ${model.questions.map(Question)}
    </div>
  </div>
`);

const Question = comp(model => html`
  <div class="question">
    <div>
      <input id="${model.text}" type=checkbox checked=${model.checked}
        onchange="${function() { emit('onCheck', {checked: this.checked, text: model.text})}}">
    </div>
    <div>
      <label for="${model.text}">${model.text}</label>
    </div>
  </div>
`);

const ReportMarkdown = comp(model => html`
  <div class="reportmarkdown">
  ${model.policy
    .filter(category => category.questions.some(q => q.checked))
    .map(CategoryMarkdown)
  }
  </div>
`);

const CategoryMarkdown = comp(model => html`
  <div>
  ## ${model.category}
  <br><br>
  ${model.questions.filter(q => q.checked).map(QuestionMarkdown)}
  <br>
  </div>
`);

const QuestionMarkdown = comp(model => {
  let ijome = {green: '✅', yellow: '⚠️', red: '🚫'};
  return html`
  * <span>${ijome[model.color]} </span>${model.text}<br>
`});

const Report = comp(model => html`
  <div class="report">${model.policy
    .filter(category => category.questions.some(q => q.checked))
    .map(CategoryReport)
  }</div>
`);

const CategoryReport = comp(model => html`
  <div class="reportcategory ">
    <h3>${model.category}</h3>
    <ul>
      ${model.questions.filter(q => q.checked).map(QuestionReport)}
    </ul>
  </div>
`);

const QuestionReport = comp(model => html`
  <li><span class="${model.color}">${model.text}</span></li>
`);

// main app
const App = comp(model => html`
  <header>
    <h1>
      Policy Engine
    </h1>
  </header>
  <main>
    <p>You want to evaluate an opportunity against a policy?
      Check the matching boxes below, and see your pitch magically generated!</p>
    <div class="legend" style="width: 100%;">
      <p>Legend:</p>
      <ul>
        <li>✅ - This is probably worth doing, and could be great.
        <li>⚠️  - We should carefully consider the trade-offs.
        <li>🚫 - This could be dangerous for the project and organization.
      </ul>
    </div>
    <div class="container">
      ${PolicyForm(model)}
      ${ReportMarkdown(model)}
    </div>
  </main>
  <footer>
    ⚙️ ⚙️ ⚙️
  </footer>
`);

// model: it will be mutated to trigger updates on changes
let model = {
  policy: policy,
  checked: 0,
  onCheck: function(e) {
    model.policy.some(cat => {
      let index = cat.questions.findIndex(el => el.text == e.detail.text);
      if (index != -1) {
        cat.questions[index].checked = e.detail.checked;
        return true;
      }
    });
    model.checked += e.detail.checked ? 1 : -1;
  }
};

window.addEventListener('onCheck', model.onCheck);

function emit(name, data) {
  window.dispatchEvent(new CustomEvent(name, { detail: data }));
}

// render
render(document.body, () => App(model));
