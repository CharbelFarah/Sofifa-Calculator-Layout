const getInputs = () => $('input.calc');

$(document).ready(function () {
  // Define the section titles and their corresponding new IDs
  const sections = {
    Attacking: 'Pace',
    Skill: 'Shooting',
    Movement: 'Passing',
    Power: 'Dribbling',
    Mentality: 'Defending',
    Defending: 'Physical',
    Goalkeeping: 'Goalkeeping',
  };

  // Mapping of input names to sections and their order
  const fieldToSection = {
    sprintSpeed: { section: 'Pace', order: 1 },
    acceleration: { section: 'Pace', order: 2 },
    finishing: { section: 'Shooting', order: 1 },
    positioning: { section: 'Shooting', order: 2 }, // Att. Position
    shotPower: { section: 'Shooting', order: 3 },
    longShots: { section: 'Shooting', order: 4 },
    penalties: { section: 'Shooting', order: 5 },
    volleys: { section: 'Shooting', order: 6 },
    vision: { section: 'Passing', order: 1 },
    crossing: { section: 'Passing', order: 2 },
    freeKick: { section: 'Passing', order: 3 }, // FK Acc.
    longPassing: { section: 'Passing', order: 4 },
    shortPassing: { section: 'Passing', order: 5 },
    curve: { section: 'Passing', order: 6 },
    agility: { section: 'Dribbling', order: 1 },
    balance: { section: 'Dribbling', order: 2 },
    reactions: { section: 'Dribbling', order: 3 },
    composure: { section: 'Dribbling', order: 4 },
    ballControl: { section: 'Dribbling', order: 5 },
    dribbling: { section: 'Dribbling', order: 6 },
    interceptions: { section: 'Defending', order: 1 },
    heading: { section: 'Defending', order: 2 },
    marking: { section: 'Defending', order: 3 }, // Def. Aware
    standingTackle: { section: 'Defending', order: 4 },
    slidingTackle: { section: 'Defending', order: 5 },
    jumping: { section: 'Physical', order: 1 },
    stamina: { section: 'Physical', order: 2 },
    strength: { section: 'Physical', order: 3 },
    aggression: { section: 'Physical', order: 4 },
    gkDiving: { section: 'Goalkeeping', order: 1 },
    gkHandling: { section: 'Goalkeeping', order: 2 },
    gkKicking: { section: 'Goalkeeping', order: 3 },
    gkReflexes: { section: 'Goalkeeping', order: 4 },
    gkPositioning: { section: 'Goalkeeping', order: 5 },
  };

  const sectionContainers = {};
  const inputsBySection = {};

  // Update section headings and IDs
  $('.grid.attribute.calculator > .col > h5').each(function () {
    const newHeading = sections[$(this).text()];
    $(this).text(newHeading);
    $(this).attr('id', newHeading);

    sectionContainers[newHeading] = $(this).parent();
  });

  let inputs = getInputs();

  // Move inputs to their respective sections and maintain order
  inputs.each(function () {
    const inputName = $(this).attr('name');
    const sectionKey = fieldToSection[inputName];

    if (sectionKey) {
      const inputParent = $(this).parent();
      const sectionId = sectionKey.section;
      const targetSection = sectionContainers[sectionId];

      targetSection.append(inputParent);

      if (!inputsBySection[sectionId]) {
        inputsBySection[sectionId] = [];
      }

      inputsBySection[sectionId].push({
        element: inputParent,
        order: sectionKey.order,
      });
    }
  });

  // Reorder inputs within each section
  $.each(inputsBySection, function (section, inputs) {
    // Sort inputs by their specified order
    inputs.sort(function (a, b) {
      return a.order - b.order;
    });

    // Append sorted inputs to the section
    const container = sectionContainers[section];
    if (container) {
      inputs.forEach(function (input) {
        container.append(input.element);
      });
    }
  });

  inputs = getInputs();

  inputs.first().focus();

  inputs.each(function (i) {
    $(this).on('input', function (e) {
      if (e.target.value?.length < 2) {
        return;
      }

      const index = i + 1 === inputs.length ? 0 : i + 1;

      inputs[index].focus();
    });

    $(this).on('focus', function () {
      this.select();

      const thisInputName = $(this).attr('name');

      const isGoalkeepingField =
        fieldToSection[thisInputName].section === 'Goalkeeping';

      let isAllOutfieldInputsFilled = true;

      inputs.each(function () {
        if (
          $(this).attr('name') !== thisInputName &&
          fieldToSection[$(this).attr('name')].section !== 'Goalkeeping' &&
          !$(this).val()
        ) {
          isAllOutfieldInputsFilled = false;
        }
      });

      if (isGoalkeepingField && isAllOutfieldInputsFilled) {
        inputs.first().focus();
      }
    });
  });
});
