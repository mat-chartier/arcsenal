import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth.service';
import { CompetitionPlanStorageService } from '../../services/competition-plan-storage.service';

// ── Types ──────────────────────────────────────────────────────────────────

type RatingKey = 'technique' | 'physique' | 'mental' | 'tactique' | 'materiel';

export interface CompetitionPlan {
  id: string;
  date: string;        // 'YYYY-MM-DD'
  discipline: string;
  archer: string;
  createdAt: string;   // ISO 8601
  ratings: Record<RatingKey, number>;  // 0 = non noté, 1-5
  objectifs: {
    contentSiPlusDe: number | null;
    mitigeSiEntre: { min: number | null; max: number | null };
    autresObjectifs: string[];
  };
  strategieTirFleche: string;
  attitudeAdopter: string;
  jeuJouer: string;
  forcesSAppuyer: string;
}

// ── Constantes ─────────────────────────────────────────────────────────────

const RATING_CRITERIA: { key: RatingKey; label: string }[] = [
  { key: 'technique', label: 'Technique' },
  { key: 'physique',  label: 'Physique'  },
  { key: 'mental',    label: 'Mental'    },
  { key: 'tactique',  label: 'Tactique'  },
  { key: 'materiel',  label: 'Matériel'  },
];

function emptyPlan(): CompetitionPlan {
  return {
    id: '',
    createdAt: '',
    date: new Date().toISOString().slice(0, 10),
    discipline: '',
    archer: '',
    ratings: { technique: 0, physique: 0, mental: 0, tactique: 0, materiel: 0 },
    objectifs: {
      contentSiPlusDe: null,
      mitigeSiEntre: { min: null, max: null },
      autresObjectifs: [],
    },
    strategieTirFleche: '',
    attitudeAdopter: '',
    jeuJouer: '',
    forcesSAppuyer: '',
  };
}

// ── Composant ──────────────────────────────────────────────────────────────

@Component({
  selector: 'app-competition-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './competition-plan.component.html',
  styleUrl: './competition-plan.component.scss',
})
export class CompetitionPlanComponent implements OnInit {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private planStorage: CompetitionPlanStorageService,
  ) {}

  view: 'list' | 'form' | 'shared' = 'list';
  plans: CompetitionPlan[] = [];
  formData: CompetitionPlan = emptyPlan();
  editingId: string | null = null;
  sharedPlan: CompetitionPlan | null = null;
  linkCopied = false;

  readonly criteria = RATING_CRITERIA;
  readonly scores = [1, 2, 3, 4, 5] as const;

  async ngOnInit(): Promise<void> {
    await this.auth.waitForAuth();
    this.plans = await this.planStorage.loadPlans();
    const shareParam = new URLSearchParams(window.location.search).get('share');
    if (shareParam) {
      try {
        this.sharedPlan = JSON.parse(decodeURIComponent(escape(atob(shareParam))));
        this.view = 'shared';
      } catch { /* lien invalide ou tronqué, on ignore */ }
    }
  }

  openNew(): void {
    const plan = emptyPlan();
    const p = this.userService.profile;
    if (p) {
      plan.archer = [p.prenom, p.nom].filter(Boolean).join(' ');
    }
    this.formData = plan;
    this.editingId = null;
    this.view = 'form';
  }

  openEdit(plan: CompetitionPlan): void {
    this.formData = JSON.parse(JSON.stringify(plan));
    this.editingId = plan.id;
    this.view = 'form';
  }

  async savePlan(): Promise<void> {
    if (!this.formData.date || !this.formData.discipline.trim()) {
      alert('Veuillez renseigner la date et la discipline.');
      return;
    }

    if (this.editingId) {
      const idx = this.plans.findIndex(p => p.id === this.editingId);
      if (idx !== -1) {
        this.plans[idx] = {
          ...this.formData,
          id: this.editingId,
          createdAt: this.plans[idx].createdAt,
        };
      }
    } else {
      this.plans.unshift({
        ...this.formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    }

    await this.planStorage.savePlans(this.plans);
    this.view = 'list';
  }

  copyShareLink(plan: CompetitionPlan, event: Event): void {
    event.stopPropagation();
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(plan))));
    const url = `${window.location.origin}/plans-competition?share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => this.linkCopied = false, 3000);
    });
  }

  async deletePlan(id: string, event: Event): Promise<void> {
    event.stopPropagation();
    if (confirm('Supprimer définitivement ce plan de compétition ?')) {
      this.plans = this.plans.filter(p => p.id !== id);
      await this.planStorage.savePlans(this.plans);
    }
  }

  // Bascule la note : re-cliquer la même valeur la remet à 0
  setRating(key: RatingKey, score: number): void {
    this.formData.ratings[key] = this.formData.ratings[key] === score ? 0 : score;
  }

  addAutreObjectif(): void {
    this.formData.objectifs.autresObjectifs.push('');
  }

  removeAutreObjectif(idx: number): void {
    this.formData.objectifs.autresObjectifs.splice(idx, 1);
  }

  updateAutreObjectif(idx: number, value: string): void {
    this.formData.objectifs.autresObjectifs[idx] = value;
  }

  trackByIdx(index: number): number {
    return index;
  }

  // Formate 'YYYY-MM-DD' → 'JJ/MM/AAAA' (sans décalage de fuseau horaire)
  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  formatCreatedAt(isoStr: string): string {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }
}
