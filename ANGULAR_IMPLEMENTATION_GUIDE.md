# Guida all'Implementazione Angular

Questo documento contiene le specifiche tecniche per implementare l'applicazione in Angular seguendo le best practices moderne.

## Architettura Generale

### Standalone Components
Utilizzare **standalone components** per tutta l'applicazione (non usare NgModules).

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, /* altri imports */],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}
```

## Signals per State Management

Utilizzare **Angular Signals** per la gestione reattiva dello stato.

### Esempi di Signal nei Componenti

```typescript
export class DashboardComponent {
  // Signals
  pratiche = signal<Pratica[]>([]);
  filtroStato = signal<string>('tutti');
  filtroAssegnazione = signal<'tutte' | 'assegnate' | 'non_assegnate'>('assegnate');
  searchTerm = signal<string>('');
  notificationCount = signal<number>(0);
  
  // Computed signals
  praticheFiltrate = computed(() => {
    return this.pratiche().filter(p => {
      // logica di filtro
    });
  });
  
  stats = computed(() => ({
    totale: this.pratiche().filter(p => p.assegnata).length,
    // altre statistiche
  }));
}
```

## Services da Implementare

### 1. AuthService
Gestione autenticazione, login/logout, token management.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSignal = signal<boolean>(false);
  private currentUserSignal = signal<User | null>(null);
  
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  currentUser = this.currentUserSignal.asReadonly();
  
  login(username: string, password: string): Observable<AuthResponse> {
    // implementazione login
  }
  
  logout(): void {
    // implementazione logout
  }
  
  getToken(): string | null {
    // get JWT token
  }
}
```

### 2. PraticheService
Gestione stato pratiche con signals e operazioni CRUD.

```typescript
@Injectable({ providedIn: 'root' })
export class PraticheService {
  private praticheSignal = signal<Pratica[]>([]);
  
  pratiche = this.praticheSignal.asReadonly();
  
  loadPratiche(): Observable<Pratica[]> {
    return this.http.get<Pratica[]>('/api/pratiche').pipe(
      tap(pratiche => this.praticheSignal.set(pratiche))
    );
  }
  
  accettaPratica(praticaId: string): Observable<Pratica> {
    // implementazione
  }
  
  rifiutaPratica(praticaId: string): Observable<void> {
    // implementazione
  }
  
  aggiornaPratica(pratica: Pratica): Observable<Pratica> {
    // implementazione
  }
}
```

### 3. NotificationService
Gestione notifiche real-time con WebSocket o polling.

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificheSignal = signal<Notification[]>([]);
  private nuovePraticheCountSignal = signal<number>(0);
  
  notifiche = this.notificheSignal.asReadonly();
  nuovePraticheCount = this.nuovePraticheCountSignal.asReadonly();
  
  constructor(private webSocketService: WebSocketService) {
    this.initWebSocket();
  }
  
  private initWebSocket(): void {
    // Connessione WebSocket per notifiche real-time
    this.webSocketService.connect('wss://api.example.com/notifications')
      .subscribe(notification => {
        this.addNotification(notification);
      });
  }
  
  addNotification(notification: Notification): void {
    this.notificheSignal.update(notifiche => [notification, ...notifiche]);
    if (notification.tipo === 'nuova_pratica') {
      this.nuovePraticheCountSignal.update(count => count + 1);
    }
  }
  
  markAsRead(notificationId: string): void {
    // implementazione
  }
}
```

### 4. StateService
Gestione stato globale dell'applicazione.

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  
  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }
  
  setError(error: string | null): void {
    this.errorSignal.set(error);
  }
}
```

## Routing e Guards

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

### Auth Guard (Functional Guard)

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};
```

## Componenti Standalone

### Esempio: Login Component

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  username = signal<string>('');
  password = signal<string>('');
  isLoading = signal<boolean>(false);
  
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    
    this.isLoading.set(true);
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        // gestione errore
      }
    });
  }
}
```

### Esempio: Dashboard Component

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // UI Components
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private praticheService = inject(PraticheService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  
  // Signals
  searchTerm = signal<string>('');
  filtroStato = signal<string>('tutti');
  filtroAssegnazione = signal<'tutte' | 'assegnate' | 'non_assegnate'>('assegnate');
  
  // From services
  pratiche = this.praticheService.pratiche;
  notificationCount = this.notificationService.nuovePraticheCount;
  notifiche = this.notificationService.notifiche;
  
  // Computed signals
  praticheFiltrate = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const stato = this.filtroStato();
    const assegnazione = this.filtroAssegnazione();
    
    return this.pratiche().filter(p => {
      const matchSearch = 
        p.numero.toLowerCase().includes(search) ||
        p.veicolo.targa.toLowerCase().includes(search) ||
        p.automobilista.cognome.toLowerCase().includes(search);
      
      const matchStato = stato === 'tutti' || p.stato === stato;
      
      const matchAssegnazione = 
        assegnazione === 'tutte' ||
        (assegnazione === 'assegnate' && p.assegnata) ||
        (assegnazione === 'non_assegnate' && !p.assegnata);
      
      return matchSearch && matchStato && matchAssegnazione;
    });
  });
  
  stats = computed(() => {
    const pratiche = this.pratiche();
    return {
      totale: pratiche.filter(p => p.assegnata).length,
      in_attesa: pratiche.filter(p => p.stato === 'in_attesa' && p.assegnata).length,
      in_riparazione: pratiche.filter(p => p.stato === 'in_riparazione' && p.assegnata).length,
      pronto: pratiche.filter(p => p.stato === 'pronto' && p.assegnata).length,
      non_assegnate: pratiche.filter(p => !p.assegnata).length,
    };
  });
  
  ngOnInit(): void {
    this.loadPratiche();
  }
  
  loadPratiche(): void {
    this.praticheService.loadPratiche().subscribe();
  }
  
  accettaPratica(praticaId: string): void {
    this.praticheService.accettaPratica(praticaId).subscribe({
      next: () => {
        this.notificationService.decrementCount();
      }
    });
  }
  
  rifiutaPratica(praticaId: string): void {
    this.praticheService.rifiutaPratica(praticaId).subscribe({
      next: () => {
        this.notificationService.decrementCount();
      }
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
```

## Template Best Practices

### Uso di Signals nei Template

```html
<!-- Accesso diretto ai signal values con () -->
<div>Totale: {{ stats().totale }}</div>

<!-- Iterazione con signal arrays -->
<div *ngFor="let pratica of praticheFiltrate()">
  {{ pratica.numero }}
</div>

<!-- Conditional rendering -->
<div *ngIf="notificationCount() > 0">
  Hai {{ notificationCount() }} nuove notifiche
</div>

<!-- Two-way binding con signals -->
<input [value]="searchTerm()" (input)="searchTerm.set($event.target.value)">
```

## HTTP Interceptors

### Auth Interceptor

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

## Error Handling

### Global Error Handler

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('Global error:', error);
    // Logica di logging/reporting
  }
}
```

## Testing

### Component Testing con Signals

```typescript
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });
  
  it('should filter pratiche correctly', () => {
    component.searchTerm.set('PR-2026-001');
    expect(component.praticheFiltrate().length).toBe(1);
  });
});
```

## Performance Optimization

1. **OnPush Change Detection**: Usare signals elimina la necessità di OnPush
2. **Lazy Loading**: Caricare moduli in modo lazy quando possibile
3. **TrackBy Functions**: Nelle ngFor per liste grandi
4. **Virtual Scrolling**: Per liste molto lunghe (CDK Virtual Scroll)

## API Integration

### Environment Configuration

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com',
  wsUrl: 'wss://api.example.com/ws'
};
```

### HTTP Service Example

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  getPratiche(): Observable<Pratica[]> {
    return this.http.get<Pratica[]>(`${this.baseUrl}/pratiche`);
  }
  
  updatePratica(id: string, data: Partial<Pratica>): Observable<Pratica> {
    return this.http.patch<Pratica>(`${this.baseUrl}/pratiche/${id}`, data);
  }
}
```

## Note Finali

- **Tutti i componenti devono essere standalone**
- **Usare signals per tutto lo state reattivo**
- **Implementare i services come Injectable con providedIn: 'root'**
- **Usare functional guards invece di class-based guards**
- **Implementare error handling appropriato**
- **Aggiungere loading states per tutte le operazioni asincrone**
- **Implementare WebSocket per notifiche real-time**
